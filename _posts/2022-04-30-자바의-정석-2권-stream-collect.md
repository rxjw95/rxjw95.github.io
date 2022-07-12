---

title: 자바의 정석 3권 - Stream의 collect
excerpt: 다시보는 자바의 정석 3판
categories: [java, book]
tags: [essential]

---

## collect

스트림의 최종 연산 중 가장 유용하다고 볼 수 있는 메서드이다.

`collect`는 Collector 인터페이스를 매개변수를 가진다. (Collectors 클래스로 미리 작성된 컬렉터를 사용할 수도 있다.)

### 스트림을 컬렉션과 배열로 변환

JDK 16에서 toList() 라는 스트림 메서드가 나오긴 했지만, 이전에는 collect()를 통해 스트림을 컬렉션으로 변환했다.

```java
public static Stream<String> generateStream() {
        return Stream.of("1", "2", "3");
}
    
List<String> stringList = generateStream().collect(Collectors.toList());
String[] stringArray = generateStream().toArray(String[]::new);
Set<String> stringSet = generateStream().collect(Collectors.toSet());
Map<Integer, String> stringMap = generateStream().collect(Collectors.toMap(Integer::parseInt, Function.identity()));
```

위처럼 List, Set이 아닌 특정 컬렉션을 지정하기 위해선 toCollection()을 이용한다.

```java
generateStream().collect(Collectors.toCollection(HashSet::new));
```

### 통계
기본형 스트림의 최종 연산에는 다양한 통계 메서드가 있는데, `collect()`에서도 사용할 수 있다.

기본 자료형을 다루는 스트림이 아니라면 객체 프로퍼티를 통해 통계를 내야할 수도 있기 때문에 효과적으로 사용될 수 있다.

통계 메서드는 모두 Collectors 클래스에서 static 메서드로 제공된다.

```java
List<Age> ages = List.of(Age.generateAge(12), Age.generateAge(17), Age.generateAge(28));

ages.stream().collect(Collectors.counting());  // 3
ages.stream().collect(Collectors.summingInt(Age::getValue));  // 57
ages.stream().collect(Collectors.averagingInt(Age::getValue)); // 19.0
ages.stream().collect(Collectors.maxBy(Comparator.comparingInt(Age::getValue))); //Optional<Age> 
ages.stream().collect(Collectors.collectingAndThen(Collectors.maxBy(Comparator.comparingInt(Age::getValue)), Optional::get)).getValue();// optional로 안받으려면 Collectors.collectingAndThen으로 감싼다.
ages.stream().collect(Collectors.minBy(Comparator.comparingInt(Age::getValue))); //Optional<Age>
```

조금 더 재밌는 건 위의 모든 요소들을 한 번에 받기 위한 `summarizingInt` 메서드도 있다.
```java
ages.stream().collect(Collectors.summarizingInt(Age::getValue))
>> IntSummaryStatistics{count=3, sum=57, min=12, average=19.000000, max=28}
```

### reduce
위와 같은 맥락으로 `collect()`에서도 reduce를 사용할 수 있다.

```java
ages.stream().reduce(Age.generateAge(0), (a, b) -> Age.generateAge(a.getValue() + b.getValue())) // Age { value= 57 }
```

### 문자열 결합 - joining()

문자열 스트림 요소들을 결합하는 메서드이다. 구분자를 지정해줄 수 있고, <u>접미사와 접두사</u>도 지정 가능하다.

```java
ages.stream()
        .map(age -> age.getValue())
        .map(intAge -> Integer.toString(intAge))
        .collect(Collectors.joining(", ", "[", "]"));
        
>> [12, 17, 28]
```

### 분할 - partitioningBy
분할은 Predicate로 조건에 일치하는 그룹과 일치하지 않는 그룹, 두 그룹으로 파티셔닝해주는 메서드이다.

두 그룹으로 나뉘어 `Map<boolean, T>`으로 반환된다.

```java
public static List<Person> makePeople() {
    return List.of(
      new Person("kim", 26, "남"),
      new Person("lee", 18, "여"),
      new Person("ryu", 18, "남"),
      new Person("park", 14, "여"),
      new Person("choi", 26, "여"),
      new Person("hong", 18, "여"),
      new Person("shin", 17, "남"),
      new Person("kang", 14, "남"),
      new Person("eun", 26, "남")
    );
}

// 20살을 기준으로 파티셔닝
Map<Boolean, List<Person>> adultMap = people.stream().collect(partitioningBy(person -> person.getAge() > 20));

// 20살을 기준으로 파티셔닝, 각 두 개의 파티션에서 나이가 가장 많은 사람을 가져온다.
Map<Boolean, Person> collect = people.stream().collect(
            partitioningBy(
                    person -> person.getAge() > 20,
                    collectingAndThen(
                            maxBy(Comparator.comparingInt(Person::getAge)),
                            Optional::get)
            )
);
```


### 그룹화 - groupingBy
그룹화는 Function으로 특정 스트림의 요소를 기준으로 그룹화하는 메서드이다.

여러 그룹으로 나뉘어 `Map<U, T>`으로 반환된다.

```java
// 성별을 기준으로 그루핑
Map<String, List<Person>> sexGroup = people.stream().collect(groupingBy(Person::getSex));

// 성별을 기준으로 그루핑하고 각 그룹의 평균 나이를 계산
Map<String, Double> averageAgeSexGroup = people.stream().collect(
                groupingBy(
                        Person::getSex,
                        averagingInt(Person::getAge)
                )
        );
```

partitioningBy, groupingBy에서 간단한 예시를 들었으나, 아주 효과적으로 많이 쓰이는 메서드라고 생각한다.

최근 실무에서도 사용자별 가입된 프로젝트 목록을 그루핑하는 로직을 collect()로 간단하게 해결했고, 다대다 관계가 있는 상황에서 큰 힘을 발휘할 수 있다.

---

틀린 점이나 보충해주실 점이 있다면 지적해주시길 바랍니다.
