---

title: Do it! Kotlin Programming(1)
excerpt: Kotlin 기초
categories: [kotlin, book]
tags: [essential]

---

## Chapter1. 코틀린 시작하기

코틀린에서 hello world를 출력해보자.

```kotlin
/* main.kt */
fun main() {
    println("hello world")
}
```

여기서 시작할 때 자바와의 차이점을 볼 수 있는데,

1. 세미콜론이 없다.

2. 프로그램을 실행시킬 최소한의 클래스와 static void main 함수가 안보인다.

우선, 첫 번째로 코틀린은 세미콜론을 생략할 수 있다. 세미콜론을 넣거나 빼거나는 사용자의 스타일 마음대로 가면 된다.

두 번째는 위 코드를 보면 자바에서는 보통 클래스가 있고 내부의 시작 메서드가 존재하는데 코틀린은 보이지 않는다.

다시 말하지만 없는 것이 아니라 보이지 않는 것이다. 코틀린은 JVM에서 실행되는데, 위의 main 함수가 있는 파일 이름을 기준으로 자바 클래스(MainKt)가 생성된다.

![decompile](https://user-images.githubusercontent.com/62179353/176894740-4856ef9b-d3d5-4858-b548-6de06421225a.png)

자세한 코드는 인텔리제이 환경에서 [Tools -> Kotlin -> Show Kotlin Bytecode] 로 메뉴를 누른 후 생성된 화면에서 [Decompile] 버튼을 눌러 확인할 수 있다.

> Java에서 Kotlin으로 Migration을 위해선 위의 decompile을 습관화하는 것이 좋다.

위의 화면을 보면 우리가 익숙하게 보는 자바의 실행문이 보인다. (이 때 class가 final인 이유는 코틀린 클래스 기본 타입이 상속을 할 수 없기 때문이다.)



## Chapter2. 변수와 자료형, 연산자

### 패키지에 별명 붙이기

```kotlin
import learn.Person as User

fun main() {
    val user = User("wook", 28)
}
```

### 변수 선언과 자료형 추론

```kotlin
fun main() {
    val name = "wook" // val 변경 불가
    var age:Int = 28      // var 변경 가능

    // name = "noname"  // error
    age = 27
}
```

코틀린의 변수 선언은 val 혹은 var로 선언한다.


`val`는 value의 약자로, 더 이상 변경될 수 없는 값으로 선언(readOnly)할 때 사용되는 키워드이다.

`var`는 variable의 약자로, 변경될 수 있는 값으로 선언할 때 사용되는 키워드이다.

자료형은 명시할 수도 있고, 추론으로도 가능한 경우가 있다.

위 코드에서 name이 선언됨과 동시에 "wook"이라는 문자열로 초기화하고 있는데, 이 때 컴파일러는 문자열임을 추론하여 타입을 명시하지 않아도 에러를 발생시키 않는다.

단, <u>자료형을 명시하지 않은 변수는 반드시 자료형을 추론할 수 있는 값을 초기화해줘야 한다. 반대로 값을 할당하지 않은 변수를 선언하려면 반드시 자료형을 명시해줘야 한다.</u>

### 자료형

코틀린의 자료형은 참조형 자료형을 사용한다.

우리는 보통 프로그래밍 언어를 공부할 때 자료형은 Reference Type과 Primitive Type으로 구분하는데, 코틀린은 모든 자료형이 Reference Type이다. 하지만 기본 자료형도 참조형을 사용하면 성능이 느려지지 않을까 하는 생각을 가질 수 있는데, 참조형으로 선언한 변수는 성능 최적화를 위해 코틀린 컴파일러에서 다시 기본형으로 대체되기 때문에 최적화를 신경 쓰지 않아도 된다.

코틀린의 정수 자료형은 다음과 같다.

|     자료형     |                크기                 |               값의 범위               |
|:-----------:|:---------------------------------:|:---------------------------------:|
|    Long     |            8바이트(64비트)             |          \-2^63~ 2^63-1           |
|     Int     |            4바이트(32비트)             |          \-2^31~ 2^31-1           |
|    Short    |            2바이트(16비트)             | \-2^15~ 2^15-1(-32,768 ~ 32,767)  |
|    Byte     |             1바이트(8비트)             |     \-2^7~ 2^7-1(-128 ~ 127)      |

코틀린의 부호없는 정수 자료형은 다음과 같다.

|   자료형   |       크기        |        값의 범위         |
|:-------:|:---------------:|:--------------------:|
|  ULong  | 8Bytes(64Bits)  |     0 - 2^64- 1      |
|  UInt   | 4Bytes(32Bits)  |      0 - 2^32-1      |
| UShort  | 2Bytes(16Bits)  | 0 - 2^16(0 - 65535)  |
|  UByte  |  1Bytes(8Bits)  |   0 - 2^8(0 - 255)   |

부호없는 정수 자료형은 다음과 같이 사용한다.

```kotlin
fun main() {
    val uint = 123u
    val ubyte:UByte = 123u
    val ushort:UShort = 123u
    val ulong = 124uL
}
```

코틀린의 실수 자료형은 다음과 같다.

|   자료형   |     크기      |              값의 범위              |
|:-------:|:-----------:|:-------------------------------:|
| Double  | 8바이트(64비트)  | 약 4.9E-324 - 1.7E+308(IEEE754)  |
|  Float  | 4바이트(32비트)  |  약 1.4E-45 - 3.4E+38(IEEE754)   |

코틀린의 논리 자료형은 다음과 같다.

|   자료형    |  크기   |    값의 범위     |
|:--------:|:-----:|:------------:|
| Boolean  |  1비트  | true, false  |

코틀린의 문자 자료형은 다음과 같다.

|  자료형  |     크기      |              값의 범위               |
|:-----:|:-----------:|:--------------------------------:|
| Char  | 2바이트(16비트)  |  0 ~ 215 ~ 1(\\u0000 - \\uffff)  |

코틀린의 문자 자료형을 선언할 때는 문자 값으로 선언해야한다. 즉, 숫자 그대로 초기화하는 것은 불가능하며 대신 정숫값을 toChar로 문자 자료형을 선언하면 된다.

```kotlin
fun main() {
    val character:Char = 52 // error
    val intToChar:Char = 52.toChar() // error
}
```

### 문자열 출력하기

#### $ 기호를 사용해서 표현식을 문자열에 넣기

```kotlin
fun main() {
    println("1 + 2 = ${1 + 2}") // result : 1 + 2 = 3
    val a = 2;
    println("${if (a % 2 == 0) "짝수" else "홀수"}") // result : 짝수
    println("${'"'}큰따옴표${'"'}와 ${'$'} 기호를 사용할 수 있다.") // result : "큰따옴표"와 $ 기호를 사용할 수 있다.
}
```

#### 형식화된 다중 문자열

문자열에 줄바꿈 문자, 탭 등의 특수문자가 포함된 문자열을 포함시켜서 출력하기 위해선 형식화된 다중 문자열을 사용한다.

```kotlin
fun main() {
    val formattedText = """동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리나라 만세
무궁화 삼천리 화려강산 대한사람 대한으로 길이 보전하세"""

    print(formattedText) // result
    /*
    동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리나라 만세
	무궁화 삼천리 화려강산 대한사람 대한으로 길이 보전하세
    */
}
```

### 자료형 검사하고 변환하기

코틀린은 변수를 사용할 때 반드시 값이 있어야 한다. (Null-Safety) 그렇기 때문에 만약 값이 할당되지 않은 변수를 사용하면 에러가 발생한다.

만약 애플리케이션 특성상 반드시 null 값을 사용해야 하는 상황이라면, 코틀린에서는 어떻게 처리해야할 것인가?

코틀린에서는 null 값을 변수에 담기 위해서는 물음표 기호를 사용해 선언한다.

```kotlin
fun main() {
    val notNull:String = null  // compile error
    val nullable:String? = null
}
```

이러한 null 허용 키워드를 사용하는 이유는 프로그램이 실행되는 도중에 값이 null인 변수에 접근하면 NullPointerException이 발생한다. NPE는 오래 전부터 개발을 할 때 골치 아픈 문제였다. 하지만, 코틀린은 변수에 null을 아예 허용하지 않아 이 문제를 미리 방지할 수 있게 되었다.

#### 세이프 콜(?.)

null이 할당되어 있을 가능성이 있는 변수를 검사하여 안전하게 호출하도록하는 기법이다.

```kotlin
fun main() {
    val str: String? = null
    print(str?.length) // null
}
```

#### non-null 단정 기호(!!.)

말 그대로 변수에 할당된 값이 null이 아님을 단정하는 기법으로 null이 할당되어 있어도 컴파일은 잘 되지만, 실행 중에 NPE를 발생한다.

```kotlin
fun main() {
    val str: String? = null
    print(str!!.length) // NPE
}
```

#### null 검사 (if 조건식와 엘비스 연산자)

코틀린은 모든 것이 식(expression)이다. 그렇기 때문에 if 구절도 식으로 사용되는 것을 기억하자. 하지만 if문을 사용하지 않고 조금 더 간단하게 표현할 수 있는 방법이 있다.

**엘비스 연산자(?:)를 사용하자.**

```kotlin
fun main() {
    val str: String? = null

    val lenByIf = if(str != null) str.length else -1
    println("str length by if = ${lenByIf}")

    val lenByElvis = str?.length ?: -1
    println("str length by elvis = ${lenByElvis}")
}
```

#### 스마트 캐스트

우리가 사용하는 값이 정수일 수도 있고, 실수일 수도 있다면 우리는 스마트 캐스트가 적용되는 자료형인 Number형이 있다. 그외에도 Any 타입도 있다.

```kotlin
fun main() {
    var number:Number = 12.2
    number = 20L
    number = 10
    number = 13.0f
    print(number)
}
```

#### 자료형 검사

자료형은 is를 사용한다. Any형은 자료형이 특별히 정해지지 않은 경우에 사용한다. 여기선 간단하게 설명하지만, Any는 모든 클래스의 뿌리이다. 즉, 코틀린의 모든 클래스는 Any형이라는 슈퍼 클래스를 가진다.

```kotlin
fun main() {
    var any:Any = 12.2f // 스마트 캐스팅

    if(any is Int) {
        print("Int")
    } else if(any is Float) {
        print("Float") // 해당 분기를 탄다.
    } else if(any is Double) {
        print("Double")
    }
}
```

---

틀린 점이나 보충해주실 점이 있다면 지적해주시길 바랍니다.
