class DictConditional(dict):

    def __init__(self, conditional=lambda: True):
        super(DictConditional, self).__init__()
        self.conditional = conditional

    def __setitem__(self, key, value):
        if key in self or self.conditional(value):
            dict.__setitem__(self, key, value)


class DictNoNone(DictConditional):

    def __init__(self, iterable=(), **kwargs):
        super(DictNoNone, self).__init__(lambda x: x is not None)

        for k, v in iterable:
            self[k] = v

        for k, v in kwargs.items():
            self[k] = v