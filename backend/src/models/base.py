import logging
import json
import datetime

from src.database import database
from peewee import Model, DateTimeField, BooleanField, TextField, ForeignKeyField


class Serializer(object):

    def convert_value(self, value):
        is1 = isinstance(value, datetime.datetime)
        is2 = isinstance(value, datetime.date)
        is3 = isinstance(value, datetime.time)

        if is1 or is2 or is3:
            return Serializer.datetime(value)
        elif isinstance(value, Model):
            return value.get_id()
        else:
            return value

    def clean_data(self, data):
        for key, value in data.items():
            if isinstance(value, dict):
                self.clean_data(value)
            elif isinstance(value, (list, tuple)):
                data[key] = map(self.clean_data, value)
            else:
                data[key] = self.convert_value(value)
        return data

    def serialize_object(self, obj, fields=None, exclude=None):
        data = BaseModel.get_dictionary_from_model(obj, fields, exclude)
        return self.clean_data(data)

    @staticmethod
    def datetime(obj):
        """Default JSON serializer."""
        import calendar
        from datetime import date, datetime

        if isinstance(obj, datetime):
            if obj.utcoffset() is not None:
                obj = obj - obj.utcoffset()

        elif isinstance(obj, date):
            obj = datetime.combine(obj, datetime.min.time())

        return int(calendar.timegm(obj.timetuple()))


class Deserializer(object):
    def deserialize_object(self, model, data):
        return BaseModel.get_model_from_dictionary(model, data)


class BaseModel(Model, Serializer, Deserializer):
    created_at = DateTimeField(default=datetime.datetime.now)
    modified_at = DateTimeField(default=datetime.datetime.now)
    deleted = BooleanField(default=False)

    class Meta:
        database = database

    @classmethod
    def fetch(cls, *selection):
        return cls.select(*selection).where(cls.deleted == False) # noqa

    def save(self, *args, **kwargs):
        self.modified_at = datetime.datetime.now()
        return super(BaseModel, self).save(*args, **kwargs)

    @classmethod
    def delete(cls, permanently=False):
        if permanently:
            return super(BaseModel, cls).delete()
        else:
            return super(BaseModel, cls).update(deleted=True, modified_at=datetime.datetime.now())

    @classmethod
    def update(cls, **update):
        update["modified_at"] = datetime.datetime.now()
        return super(BaseModel, cls).update(**update)

    def delete_instance(self, permanently=False, recursive=False, delete_nullable=False):

        if permanently:
            return self.delete(permanently).where(self.pk_expr()).execute()
        else:
            self.deleted = True
            return self.save()

    def to_json(self):
        return json.dumps(self, default=self.serialize_object)

    def __str__(self):
        return self.get_dictionary()

    def get_dictionary(self, fields=None, exclude=None):
        return BaseModel.get_dictionary_from_model(self, fields, exclude)

    @staticmethod
    def get_dictionary_from_model(model, fields=None, exclude=None):
        model_class = type(model)
        data = {}

        fields = fields or {}
        exclude = exclude or {}
        curr_exclude = exclude.get(model_class, [])
        curr_fields = fields.get(model_class, model._meta.get_field_names())

        for field_name in curr_fields:
            if field_name in curr_exclude:
                continue

            field_obj = model_class._meta.fields[field_name]
            field_data = model._data.get(field_name)
            if isinstance(field_obj, ForeignKeyField) and field_data and field_obj.rel_model in fields:
                rel_obj = getattr(model, field_name)
                data[field_name] = BaseModel.get_dictionary_from_model(rel_obj, fields, exclude)
            else:
                data[field_name] = field_data

        return data

    @staticmethod
    def get_model_from_dictionary(model, field_dict):
        if isinstance(model, Model):
            model_instance = model
            check_fks = True
        else:
            model_instance = model()
            check_fks = False
        models = [model_instance]
        for field_name, value in field_dict.items():
            field_obj = model._meta.fields[field_name]
            if isinstance(value, dict):
                rel_obj = field_obj.rel_model
                if check_fks:
                    try:
                        rel_obj = getattr(model, field_name)
                    except field_obj.rel_model.DoesNotExist:
                        pass
                    if rel_obj is None:
                        rel_obj = field_obj.rel_model
                rel_inst, rel_models = BaseModel.get_model_from_dictionary(rel_obj, value)
                models.extend(rel_models)
                setattr(model_instance, field_name, rel_inst)
            else:
                setattr(model_instance, field_name, field_obj.python_value(value))
        return model_instance, models

    @staticmethod
    def get_object_id(obj):
        if isinstance(obj, BaseModel):
            return obj.id
        elif isinstance(obj, int):
            return obj
        else:
            try:
                return int(obj)
            except (TypeError, ValueError):
                return None


class JsonField(TextField):
    def db_value(self, value):
        return json.dumps(value, default=Serializer.datetime)

    def python_value(self, value):
        try:
            return json.loads(value)
        except ValueError as e:
            logging.error("Failed to encode JSON: %s" % e.message)
            return dict()


class EnumField(TextField):

    def values(self, values):
        self.values = values
        return self

    def db_value(self, value):
        if value in self.values:
            return value
        else:
            return self.default
