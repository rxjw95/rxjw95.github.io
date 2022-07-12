---

title: 자바의 정석 3권 - Lambda와 Stream(3)
excerpt: 다시보는 자바의 정석 3판
categories: [java, book]
tags: [essential]

---

## 스트림(Stream)

스트림은 데이터 소스를 추상화하고, 데이터를 다루는데 자주 사용되는 메서드들을 정의해 놓았다.

데이터 소스를 추상화를 했다는 것은 다양한 타입의 데이터를 같은 방식으로 다룰 수 있다는 뜻이며, 재사용성이 높아진다는 것이다.


- **특징**

**스트림은 데이터 소스를 변경하지 않는다.**
스트림을 얻은 데이터는 Read만 한다. 데이터 변경이 필요하다면, 새로운 결과를 컬렉션이나 배열에 담아서 반환한다.

**스트림은 일회용이다.**
스트림은 최종 연산이 끝나면 다시 사용할 수 없고, 재생성해야 한다.

**스트림은 작업을 내부 반복으로 처리한다.**
스트림을 사용함으로써 for문을 순회하는 로직을 스트림 메서드로 처리할 수 있다.

**지연된 연산**
스트림의 최종 연산이 수행되기 전까지는 중간 연산이 수행되지 않는다.

- **스트림의 연산**

스트림은 다양한 연산 메서드를 제공하는데 이를 통해 복잡한 작업을 처리할 수 있고, 명시적인 코드를 작성할 수 있다.

스트림은 `중간 연산`과 `최종 연산`으로 분류할 수 있다.
중간 연산은 연산 결과를 스트림으로 반환하여 중간 연산을 연속적으로 체이닝할 수 있다.
반면에 최종 연산은 스트림의 요소를 소모하면서 연산을 수행하여 단 한번만 연산이 가능하다.

Stream에는 아주 다양한 메서드들이 존재하는데, 메서드 명을 봐도 무엇을 의미하는지 아주 명시적으로 알 수 있기 때문에 모든 메서드를 다루지는 않는다.

대표적으로 사용되는 중간 연산인 `map`, `flatMap`, `filter`, 최종 연산인 `reduce`, `collect`에 대해서 중점적으로 다룬다.

## 스트림 만들기

### 컬렉션
```java
Stream<T> Collection.stream()
```

### 배열
```java
Stream<T> Stream.of(T[])
Stream<T> Stream.of(T... values)
Stream<T> Arrays.steram(T[])
Stream<T> Arrays.steram(T[], int startInclusive, int endExclusive)

```

### 특정 범위의 정수
```java
IntStream IntStream.range(int begin, int end)
IntStream IntStream.rangClosed(int begin, int end)
```

### 임의의 수
```java
IntStream new Random().ints() // 무한 스트림
LongStream new Random().longs()
DoubleStream new Random().doubles()
```

> Random 클래스로 임의의 수 스트림을 만들면 무한 스트림이 반환되어 반드시 limit()으로 개수를 제한해줘야 한다.

### iterate(), generate()

```java
static <T> Stream<T> iterate(T seed, UnaryOperator<T> func)
static <T> Stream<T> generate(Supplier<T> s)
```

`iterate`는 seed 값을 받아 지정된 값으로부터 시작해서, 람다식 func에 의해 계산된 결과를 seed값으로 해서 계산을 반복한다.

```java
public Stream<Integer> evenIterate() {
        return Stream.iterate(0, n -> n + 2);
    }
```

`generate`는 매개변수를 보면 알다시피 매개변수가 없는 Supplier로 값을 만들어낸다.

```java
   public Stream<Integer> randomGenerate(int begin, int end) {
        return Stream.generate(() -> {
            try {
                return SecureRandom.getInstanceStrong().nextInt(begin, end);
            } catch (NoSuchAlgorithmException e) {
                throw new RuntimeException(e);
            }
        });
    }
```

## 스트림 중간연산

### 자르기 - skip(), limit()
여러 개의 요소를 가진 스트림에서 n개를 자른 스트림을 반환하는 메서드들이다.

`skip`은 첫 요소로부터 n개를 무시할 수 있고, `limit`는 최대 n개의 요소를 남기고 나머지는 자르고 반환한다.

```java
Stream<Integer> intStream = Stream.of(1, 2, 3, 4, 5).skip(3); // 4, 5
        
Stream<Integer> intStream = Stream.of(1, 2, 3, 4, 5).limit(3); // 1, 2, 3 
```


### 거르기 - filter(), distinct()
원하는 조건에 맞춰서 요소를 걸러낼 수 있는 메서드들이다.

`distinct`는 중복 요소를 제거하고, `filter`는 Predicate로 조건에 맞지 않는 값은 걸러낸다.

```java
Stream.of(1, 1, 1, 2, 2, 3, 3, 3).distinct() // 1, 2, 3
```

```java
enum Predicates{
    EVEN(i -> i % 2 == 0), ODD(i -> i % 2 != 0);

    private final Predicate<Integer> predicate;

    Predicates(Predicate<Integer> predicate) {
        this.predicate = predicate;
    }

    public Predicate<Integer> match() {
        return predicate;
    }
}

Stream.of(1, 2, 3).filter(Predicates.EVEN.match()); // 2
```

### 정렬 - sorted()
`sorted()`는 사전순 정렬
`sorted(Comparator<? super T> comparator)`은 정렬 기준을 커스터마이징할 수 있다.

```java
Stream.of("a", "c", "z", "d", "x", "AA", "Ca", "ac").sorted();
Stream.of("a", "c", "z", "d", "x", "AA", "Ca", "ac").sorted(Comparator.reverseOrder()); // 역순 정렬
```

### 변환 - map(), flatMap(), peek()

`map`은 스트림 요소를 다른 값이나 다른 타입으로 변환할 때 사용하는 메서드이다.

```java
Stream.of("1", "2", "3").map(Integer::parseInt);
```

`peek`은 연산과 연산 사이에 올바르게 처리되었는지, 디버그용으로 값을 출력해볼 때 사용하는 메서드이다.

```java
Stream.of("1", "2", "3")
                .map(Integer::parseInt)
                .peek(System.out::println)
                .filter(Predicates.ODD.match())
```

`flatMap`은 스트림의 요소가 배열인 경우(`Stream<T[]>`), 그 요소들을 모두 펼칠 때(`Stream<T>`) 사용하는 메서드이다.

```java
Stream.of(new String[]{"a", "c", "z", "d"}, new String[]{"x", "AA", "Ca", "ac"})
                .flatMap(Arrays::stream)
                .map(str -> str.substring(0, 1));
```

## 스트림 최종연산

### forEach()
`Consumer<? extends T>`를 파라미터로 받아 요소를 소비해 내부 반복을 해주는 메서드이다.

### 조건 검사 - allMatch(), anyMatch(), noneMatch(), findFirst(), findAny()
`allMatch`는 Predicate<T>의 조건에 요소 모두가 일치하다면 참을 반환한다.
`anyMatch`는 Predicate<T>의 조건에 요소 하나라도 일치한다면 참을 반환한다.
`noneMatch`는 Predicate<T>의 조건에 요소 모두가 일치하지 않는다면 참을 반환한다.

`findFirst()`와 `findAny()`는 `Optional<T>`를 반환하여 후처리할 수 있다.

### 통계 - count(), sum(), average(), max(), min()
`count`는 스트림에 있는 요소 개수를 반환한다.
`sum`은 기본형 스트림에 있는 요소 합계를 반환한다.
`average`도 기본혀 스트림에 있는 요소 평균을 반환한다.
`max`와 `min`은 `Comparator<? super T>`를 받아 스트림 요소의 최대, 최소를 반환한다.

### 누산 - reduce
스트림의 요소를 하나씩 줄여나가면서 연산을 수행하고 최종 결과를 반환한다.

여러 종류로 나뉘어 있는데, 하나씩 간단하게 설명한다.

```java
Optional<T> reduce(BinaryOperator<T> acc);
T reduce(T identity, BinaryOperator<T> acc);
U reduce(U identity, BiFunction<U, T, U> acc, BinaryOperator<U> combiner)
```

보시다시파, BinaryOperator 하나만을 사용하는 reduce는 Optional로 받는다. 
그 이유는 identity라는 고유값이 없기 때문에 요소를 reduce해서 그 결과를 장담할 수 없기 때문이다.
```java
Stream.of(1, 2, 3)
                .reduce((a, b) -> a + b)
                .ifPresent(System.out::println);
```

반면에, identity와 BinaryOperator, 두 개의 파라미터를 받으면 Optional이 아니다. 
그 이유는 identity라는 고유값이 있기 때문에 요소가 없어서 그 결과는 고유값이 되기 때문이다.
```java
Stream.of(1, 2, 3)
                .reduce(0, (a, b) -> a + b)
```

마지막으로, combiner가 추가되어, 세 개의 파라미터를 받는 reduce는 병렬 스트림의 결과를 합칠 때 사용하는데, 쓸 일이 있다면 다뤄보겠다.

마지막으로 스트림 최종 연산에서 가장 많이 사용되는 Collect()에 대해서는 활용성이 많아서 따로 포스팅을 진행할 예정이다.

---

틀린 점이나 보충해주실 점이 있다면 지적해주시길 바랍니다.
