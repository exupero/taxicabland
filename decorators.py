from functools import wraps


def setup_children(method):
    @wraps(method)
    def wrapper(graphic, *args, **kwargs):
        graphic.children = []
        method(graphic, *args, **kwargs)
    return wrapper


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
