from functools import wraps


def updates(method):
    @wraps(method)
    def wrapper(graphic, *args, **kwargs):
        method(graphic, *args, **kwargs)
        graphic.update()
    return wrapper


def notifies(method):
    @wraps(method)
    def wrapper(graphic, *args, **kwargs):
        method(graphic, *args, **kwargs)
        graphic.notify()
    return wrapper
