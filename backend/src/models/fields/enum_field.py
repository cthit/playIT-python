from peewee import TextField


class EnumField(TextField):
    def values(self, values):
        self.values = values
        return self

    def db_value(self, value):
        if value in self.values:
            return value
        else:
            return self.default