---

title: Do it! Kotlin Programming(2) - 함수 선언과 호출
excerpt: Kotlin 기초
categories: [kotlin, book]
tags: [essential]

---


## 함수 정의

코틀린에서 함수를 정의할 땐 `fun + 함수형 + (파라미터: 타입, ..) : 반환 타입 { }`을 기본으로 한다.

그리고 만약 블록 내에 수행하는 코드가 한줄이라면 중괄호를 생략하고 = 으로 대체할 수 있다.

```kotlin
fun sum(a: Int, b: Int): Int {
    return a + b
}

/*
fun sum(a: Int, b: Int) = a + b
 */
```

## 반환 값이 없는 함수 정의

코틀린에서는 void 라는 키워드가 없고, Unit이라는 특수한 자료형을 사용해서 반환한다.

```kotlin
fun printHello(): Unit {
    print("hello")
}

/*
fun printHello2() = print("hello")
 */
```

> void는 정말 아무것도 반환하지 않고, Unit은 특수한 객체를 반환한다.

## default 매개변수 선언

코틀린에선 파라미터의 기본값을 설정해놓을 수 있다.

```kotlin
fun main() {
    printInfo("우기", "abcd@abc.com"); // 이름은 우기, 이메일은 abcd@abc.com
    printInfo("길동"); // 이름은 길동, 이메일은 nothing
}

fun printInfo(name:String, email:String = "nothing"): Unit {
    println("이름은 ${name}, 이메일은 ${email}");
}
```

## 매개변수의 이름과 함께 함수 호출

함수에 파라미터가 많으면 함수 호출 시 순서를 헷갈릴 수 있다. 이를 위해서 코틀린은 순서와 상관없이 매개변수의 이름을 함께 전달해서 값을 지정할 수 있다.

```kotlin
fun main() {
    printInfo(email = "mr.sunshine@kor.kor", name = "유진초이"); // 이름은 유진초이, 이메일은 mr.sunshine@kor.kor
}

fun printInfo(name:String, email:String = "nothing"): Unit {
    println("이름은 ${name}, 이메일은 ${email}");
}
```

## 가변적인 개수의 인자를 전달받는 함수

코틀린은 함수 파라미터에 vararg 키워드를 사용해서 가변 인자를 전달받는다.

```kotlin
fun main() {
    assignNumber(1, 2, 3, 4, 5);
}

fun assignNumber(vararg nums:Int) {
    for(num in nums) print("${num} ")
}
```

---

틀린 점이나 보충해주실 점이 있다면 지적해주시길 바랍니다.
