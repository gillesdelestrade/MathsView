# Chaque script est séparé du suivant par une ligne de démarcation. Le fichier
# sert à la fois de référence (exécutée par le vrai python3) et d'entrée pour le
# mini-interpréteur : tout écart entre les deux est un défaut du mini.
print(1 + 2, 3 * 4, 10 - 3)
#====#
print(7 / 2)
print(6 / 3)
print(1 / 3)
#====#
print(7 // 2, -7 // 2, 7 // -2, -7 // -2)
#====#
print(7 % 2, -7 % 2, 7 % -2, -7 % -2)
#====#
print(2 ** 10, 2 ** 0, 2 ** -1)
#====#
print(-2 ** 2)
print((-2) ** 2)
print(-2 ** 3)
#====#
print(2 ** 3 ** 2)
#====#
print(3.0, 3, 3.5, -0.0)
#====#
print(0.1 + 0.2)
#====#
print(1e3, 1.5e-3)
#====#
print(10 / 4 * 2, 10 * 4 / 2)
#====#
print(1 + 2 * 3 - 4 / 2)
#====#
x = 5
x += 3
x *= 2
x -= 1
print(x)
y = 7
y //= 2
print(y)
z = 7
z /= 2
print(z)
#====#
def f(x):
    return x * x - 4 * x + 1

for x in range(-2, 7):
    print(x, f(x))
#====#
def f(x):
    return 1 / x

for k in range(1, 6):
    print(k, f(k))
#====#
def f(x):
    return x ** 3 - 3 * x

for i in range(-30, 31, 10):
    x = i / 10
    print(x, f(x))
#====#
for i in range(5):
    print(i)
#====#
for i in range(10, 0, -3):
    print(i)
#====#
for i in range(5, 2):
    print(i)
print("fini")
#====#
s = 0
for i in range(1, 101):
    s += i
print(s)
#====#
n = 0
while n < 5:
    n += 1
    if n == 3:
        continue
    if n == 5:
        break
    print(n)
print("reste", n)
#====#
if 3 > 2:
    print("oui")
else:
    print("non")
#====#
x = 7
if x < 5:
    print("petit")
elif x < 10:
    print("moyen")
else:
    print("grand")
#====#
print(3 > 2, 3 >= 3, 2 != 2, "a" < "b")
#====#
print(True and False, True or False, not True)
print(1 and 2, 0 or 5, 0 and 3)
#====#
L = [1, 2, 3]
print(L, len(L), L[0], L[-1])
L[1] = 99
print(L)
L.append(4)
print(L)
#====#
L = []
for i in range(4):
    L.append(i * i)
print(L)
print(sum(L), min(L), max(L))
#====#
print(min(3, 1, 2), max(3, 1, 2))
#====#
print(abs(-3), abs(3.5), abs(-2.5))
#====#
print(round(0.5), round(1.5), round(2.5), round(-0.5), round(-1.5))
#====#
print(round(3.14159, 2), round(2.71828, 3), round(1.005, 2))
#====#
print(int(3.9), int(-3.9), int("42"), float(3), float("2.5"))
#====#
print(str(3), str(3.0), "a" + "b", "ab" * 3)
#====#
print(len("bonjour"), "bonjour"[0])
#====#
for c in "abc":
    print(c)
#====#
import math
print(math.sqrt(9), math.sqrt(2))
print(math.floor(2.7), math.ceil(2.1))
#====#
from math import sqrt
print(sqrt(16))
#====#
def somme(a, b):
    return a + b

def carre(x):
    return x * x

print(somme(2, 3), carre(5), somme(carre(2), carre(3)))
#====#
def fact(n):
    if n <= 1:
        return 1
    return n * fact(n - 1)

print(fact(0), fact(5), fact(10))
#====#
def rien(x):
    x = x + 1

print(rien(3))
#====#
def f(x):
    return 2 * x + 1

a = 3
print(f(a), a)
#====#
# un commentaire seul
x = 1  # un commentaire en fin de ligne
print(x)  # encore un
#====#
print()
print("après le vide")
#====#
print("a", 1, 2.0, True, None, [1, "b"])
#====#
def f(x):
    return x * x

m = 0
for i in range(-5, 6):
    if f(i) > m:
        m = f(i)
print(m)
#====#
tab = []
for i in range(-3, 4):
    tab.append(f_val(i))

def f_val(x):
    return x
#====#
def f(x):
    return -x * x + 4 * x - 1

meilleur = -1000
ou = 0
for i in range(0, 41):
    x = i / 10
    v = f(x)
    if v > meilleur:
        meilleur = v
        ou = x
print(ou, meilleur)
#====#
print(5 == 5.0, 5.0 == 5)

#====#
print(1/3, 2/3, 1/7)
#====#
print(100000000000.0, 1e16, 1e21, 0.00001)
#====#
for i in range(-20, 21, 5):
    x = i / 10
    print(x, round(x * x - 2 * x, 2))
#====#
def f(x):
    return (x - 1) * (x - 3)

for i in range(0, 5):
    print(i, f(i))
#====#
def f(x):
    return x ** 0.5

for i in range(0, 5):
    print(i, round(f(i), 3))
#====#
print(9 ** 0.5, 2 ** 0.5)
#====#
x = 3
def g(y):
    return y + 1
print(g(x), x)
#====#
L = [3, 1, 2]
print(len(L))
for v in L:
    print(v)
#====#
print(sum([1, 2, 3]), sum([1.5, 2.5]))
#====#
c = 0
for i in range(3):
    for j in range(3):
        c += 1
print(c)
#====#
print(True + True, False * 5)
#====#
print(int(True), float(False))
#====#
if []:
    print("non vide")
else:
    print("vide")
#====#
print(0.1 + 0.2 == 0.3)
print(round(0.1 + 0.2, 10) == 0.3)

#====#
print(1e15, 1e16, 1e17)
print(1e-4, 1e-5, 1.5e-5)
print(-1e16, -0.00001)
#====#
print(123456789.123456, 1234567890123456.7)
#====#
print(2 ** 40, 2 ** 40 * 1.0)
#====#
print(1 / 3 * 3, 0.1 * 3)
