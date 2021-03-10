import ctypes
import threading

class InterruptableThread(threading.Thread):
    def __init__(self, func, *args, **kwargs):
        threading.Thread.__init__(self)
        self._func = func
        self._args = args
        self._kwargs = kwargs
        self._result = None
        self.name = func.__name__

    def run(self):
        self._result = self._func(*self._args, **self._kwargs)

    def get_id(self):
        # returns id of the respective thread
        if hasattr(self, '_thread_id'):
            return self._thread_id
        for id, thread in threading._active.items():
            if thread is self:
                return id

    def raise_exception(self):
        thread_id = self.get_id()
        res = ctypes.pythonapi.PyThreadState_SetAsyncExc(thread_id, ctypes.py_object(SystemExit))
        if res > 1:
            ctypes.pythonapi.PyThreadState_SetAsyncExc(thread_id, 0)
            print('Exception raise failure')

    @property
    def result(self):
        return self._result


class Timeout(object):
    def __init__(self, time):
        self._time = time

    def __call__(self, f):
        def wrapped_f(*args, **kwargs):
            it = InterruptableThread(f, *args, **kwargs)
            it.start()
            it.join(self._time)
            if not it.is_alive():
                return it.result
            raise TimeoutError('Function takes too long')
        return wrapped_f
