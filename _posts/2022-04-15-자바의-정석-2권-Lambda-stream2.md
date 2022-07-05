---

title: 자바의 정석 3권 - Lambda와 Stream(2)
excerpt: 다시보는 자바의 정석 3판
categories: [java, book]
tags: [essential]

---

## function package

우리가 일반적으로 사용하는 메서드의 타입은 대부분 비슷하다.

매개변수가 없거나 한 개 또는 두 개, 반환 값은 없거나 한 개이다(제네릭 메서드라면 아주 많은 메서드를 포용할 수 있다).

그래서 `java.util.function` 패키지에는 일반적으로 자주 쓰이는 형식의 메서드를 함수형 인터페이스로 미리 정의해놓았다.

우리는 이전 포스팅에서 기본적인 람다식의 문법만 이해하고, 새로운 함수형 인터페이스를 만들지 말고 가능하면 패키지의 인터페이스를 활용하는 것이 좋다.

다음은 function 패키지의 다양한 인터페이스를 소개한다. 그리고 책과는 달리 function 패키지 외에 함수형 인터페이스를 몇가지 소개한다. 

- `java.util.function`

|   함수형 인터페이스    |  Descriptor   |         Method          |
|:--------------:|:-------------:|:-----------------------:|
|  Consumer<T>   |   T -> void   |    void accept(T t)     |
|  Supplier<T>   |    () -> T    |         T get()         |
| Function<T, R> |    T -> R     |      R apply(T t)       |
|  Predicate<T>  | T -> boolean  |    boolean test(T t)    |

여기서 조금 특별한 Function의 변형으로 Predicate가 있는데, 제네릭이 아닌 boolean형으로 return 한다는 것이다.

다음은 `Function`과 `Predicate`를 활용한 예시 코드이다.
```java
String introduce = "i'm ground! introduce myself";

Function<String, Integer> lengthConverter = str -> str.length();
Predicate<Integer> greaterThan5 = val -> val > 5;

if(greaterThan5.test(lengthConverter.apply(introduce))) {
   System.out.println("greater than 5");
} else {
   System.out.println("less than 5");
}
```

`Predicate`에는 `and()`, `or()`, `negate()` 라는 static method가 있는데, boolean들을 연결할 수 있다.

```java
tring text = "183";
Predicate<String> pattern = str -> str.matches("[0-9]*");
Predicate<String> matcher = str -> str.length() < 5;
Predicate<String> validator = pattern.and(matcher);

if(validator.test(text)) {
    System.out.println("validated.");
}
```

- `java.util.Comparator`, `java.lang`, `java.util.concurrent.Callable`, 

|   함수형 인터페이스    |  Descriptor   |         Method          |
|:--------------:|:-------------:|:-----------------------:|
| Comparator<T>  | (T, T) -> int | int compare(T o1, T o2) |
|    Runnable    |  () -> void   |       void run()        |
|    Callable    |    () -> T    |        V call()         |

다음은 `Callable`을 활용한 예시 코드이다.

```java
Callable<Integer> randomGenerator = () -> SecureRandom.getInstanceStrong().nextInt(0, 10);
Integer randomNumber = randomGenerator.call();
        
System.out.println(randomNumber);
```

### 두 개의 인자를 받는 Bi 인터페이스

특정 인자를 받는 Predicate, Consumer, Function 등은 두 개 이상의 타입을 받을 수 있는 인터페이스가 존재한다.

|      함수형 인터페이스      |    Descriptor     |         Method         |
|:-------------------:|:-----------------:|:----------------------:|
|  BiConsumer<T, U>   |  (T, U) -> void   | void accept(T t, U u)  |
| BiFunction<T, U, R> |    (T, U) -> R    |   R apply(T t, U u)    |
|  BiPredicate<T, U>  | (T, U) -> boolean | boolean test(T t, U u) |

```java
BiPredicate<Integer, Integer> greaterThan = (a, b) -> a > b;
        
if(greaterThan.test(5, 6)) {
    System.out.println("nono");
}

```

### Operator
Function의 또 다른 변형으로 매개 변수의 타입과 반환 타입이 같아야 한다.

|     함수형 인터페이스     | Descriptor  |       Method        |
|:-----------------:|:-----------:|:-------------------:|
| UnaryOperator<T>  |  (T) -> T   |    T apply(T t)     |
| BinaryOperator<T> | (T, T) -> T | T apply(T t1, T t2) |

```java
BinaryOperator<Integer> sum = (a, b) -> a + b;

System.out.println(sum.apply(3, 5));
```
     
### 기본형 특화 인터페이스

현재까지의 함수형 인터페이스의 파라미터는 모두 제네릭 타입이었으나, 그 타입이 확실하게 기본형인 경우 기본형을 제공하는 것이 더 효율적이다.

이러한 문제를 기본형 특화 함수형 인터페이스가 해결해준다.

위에 소개한 모든 함수형 인터페이스에는 기본형을 지원한다.

#### Predicate (T -> boolean)
기본형을 받은 후 boolean 리턴

- IntPredicate
- LongPredicate
- DoublePredicate

#### Consumer (T -> void)
기본형을 받은 후 소비

- IntConsumer
- LongConsumer
- DoubleConsumer

#### Function (T -> R)
기본형을 받아서 기본형 리턴

- IntToDoubleFunction
- IntToLongFunction
- LongToDoubleFunction
- LongToIntFunction
- DoubleToIntFunction
- DoubleToLongFunction

기본형을 받아서 R 타입 리턴

- IntFunction<R>
- LongFunction<R>
- DoubleFunction<R>

T 타입 받아서 기본형 리턴

- ToIntFunction<T>
- ToDoubleFunction<T>
- ToLongFunction<T>

#### Supplier (() -> T)
아무것도 받지 않고 기본형 리턴

- BooleanSupplier
- IntSupplier
- LongSupplier
- DoubleSupplier

## 메서드 참조

람다식도 간단한데, 더 간단한 표현 방법이 있다.

바로 메서드 참조라는 것인데, 아주 간단하게 작성할 수 있다.

다음의 코드를 보자.

```java
Function<String, Integer> lambda = s -> Integer.parseInt(s);
Function<String, Integer> methodRef = Integer::parseInt;
```

위의 코드를 보면 람다식의 일부가 생략되었지만, 컴파일러가 이를 유추를 할 수 있다.

`parseInt`라는 메서드를 통해서 혹은 좌변의 Function의 제네릭 타입으로 쉽게 파악할 수 있다.

3가지 경우의 메서드 참조 방법이 있다.

|     category      |           lambda           |    method ref.    |
|:-----------------:|:--------------------------:|:-----------------:|
|    스태틱 메서드 참조     | (x) -> ClassName.method(x) | ClassName::method |
|    인스턴스 메서드 참조    | (obj, x) -> obj.method(x)  | ClassName::method |
| 특정 객체 인스턴스 메서드 참조 |    (x) -> obj.method(x)    |    obj::method    |

---

틀린 점이나 보충해주실 점이 있다면 지적해주시길 바랍니다.
