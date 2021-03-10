from numbers import Number

n = input("Type in the number: ")
number = Number()
data = number.run(n)

if data:
    for k, v in data.items():
        if v:
            print("{0}: {1}".format(k, v))
