import datetime
import json
import uuid
from peewee import Model, DateTimeField, BooleanField, ForeignKeyField,CharField

from src.database import database
from src.models.serializer import Serializer


class BaseModel(Model, Serializer):
    created_at = DateTimeField(default=datetime.datetime.now)
    modified_at = DateTimeField(default=datetime.datetime.now)
    deleted = BooleanField(default=False)
    uuid = CharField(null=False)

    class Meta:
        database = database

    @classmethod
    def fetch(cls, *selection):
        return cls.select(*selection).where(cls.deleted == False)  # noqa

    def save(self, *args, **kwargs):
        self.uuid=str(uuid.uuid4())
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
        data['id']=data['uuid']
        return data
