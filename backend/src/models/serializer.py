import calendar
from datetime import date, datetime


class Serializer(object):
    @staticmethod
    def datetime(obj):
        """Default JSON serializer."""

        if isinstance(obj, datetime):
            if obj.utcoffset() is not None:
                obj = obj - obj.utcoffset()

        elif isinstance(obj, date):
            obj = datetime.combine(obj, datetime.min.time())

        return int(calendar.timegm(obj.timetuple()))
