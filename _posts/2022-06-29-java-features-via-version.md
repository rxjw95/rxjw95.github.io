---

title: Java 버전별 기능 정리(9~17)
excerpt: Java의 버전별 기능을 정리해보는 시간
categories: [java]
tags: [features]

---

회사의 java 17로 업그레이드 제안을 하고 마이그레이션을 완료했다.

팀원들에게 기능들에 대한 컨텍스트를 소개하기 위해 작성했던 글을 포스팅한다.

---

### **Java 9 (2018년 3월 지원 종료)**

-   **자바 모듈화(JDK 모듈 분리 기능)**

-   **try-with-resource 구문 개선**  
    관리하고자 하는 자원 객체를 try 구문 외부에서도 선언 가능

```java
final Scanner scanner = new Scanner(new File("testRead.txt"));
PrintWriter writer = new PrintWriter(new File("testWrite.txt"))
try (scanner;writer) { 
    // omitted
}
```

-   **interface private method 추가**  
    default, static method에 대한 공통 로직을 공유하는 용도로 사용


-   **Compact Strings (String 개선)**  
    기본적으로 사용되는 UTF-16 charset String의 비효율적인 용량 개선  
    String 내부에 char[] → byte[]로 변경 및 String 생성 시 literal에 영문자만 있는 경우 Latin1 방식을 사용해 각 문자 당 1byte 차지  
    benchmark 상 String 처리 속도가 20% 정도 개선, String 으로 인한 Garbage 양이 30% 정도 감소

-   **Http Client API 추가**   
    URLConnection을 개선한 기능 및 명명 규칙을 제공하는 API  
    HTTP 2.0, WebSocket, Proxy, Asynchronous (CompletableFuture) 지원




### **Java 10 (2018년 9월 지원 종료)**

-   **지역 변수 타입 추론 기능 var 키워드 추가**


```java
var message = "Hello, Java 10";
```

-   **G1 GC 성능 개선**  
    Mark-Sweep Algorithm의 수행 주체를 단일 스레드에서 병렬 스레드로 변경


-   **Unmodifiable Collections** **기능 추가**  
    Collection 클래스들에 기존 Colleciton을 Unmodifiable Collection으로 복사해주는 copyOf() 스태틱 메서드  
    Stream API의 collect()에서 사용되는 Collectors.toUnmodifiableList() 메서드 추가

-   **Optional API 기능 추가**  
    Optional, OptionalDouble, OptionalInt 등에서 사용 가능한 orElseThrow 메서드가 추가




### **Java 11 (LTS, 2026년 9월)**

-   **HTTP Client API 정식 통합 (JEP 321)  
    **jdk.incubator.http에서 java.net.http로 변경

-   **지역 변수 타입 추론 기능 개선**   
    Lambda expression에서 var를 사용 가능

```java
void var_SetWoogie() {
    var name = "woogie";
    assertEquals("woogie", name);
}
```

-   **String API 메서드 추가**  
    isBlank, lines, strip, stripLeading, stripTrailing, repeat 메서드 추가

```java
@ParameterizedTest
@ValueSource(strings = " ")
@EmptySource
void isBlank_SetEmptyStringAndBlankString_true(String input) {
    assertTrue(input.isBlank());
}
```

```java
@Test
void lines() {
    String text = "동해물과 백두산이 마르고 닳도록\n하느님이 보우하사 우리나라 만세\n무궁화 삼천리 화려강산\n대한사람 대한으로 길이 보전하세";
    String[] expected = {
            "동해물과 백두산이 마르고 닳도록",
            "하느님이 보우하사 우리나라 만세",
            "무궁화 삼천리 화려강산",
            "대한사람 대한으로 길이 보전하세"};

    String[] lines = text.lines().toArray(String[]::new);

    assertArrayEquals(expected, lines);
}
```

```java
@Test
void strip() {
    String text = " 양쪽 공백 및 인덴트 그리고 개행 모두 제거 \n     ";
    assertEquals("양쪽 공백 및 인덴트 그리고 개행 모두 제거", text.strip());
}
```

```java
@Test
void stripIndent() {
    String text = " 개행을 기준으로 양쪽 공백 및 인덴트 제거, 개행은 지워지지 않음  \n    ";
    assertEquals("개행을 기준으로 양쪽 공백 및 인덴트 제거, 개행은 지워지지 않음\n", text.stripIndent());
}
```

```java
@Test
void stripLeading() {
    String text = " \n 왼쪽 공백 및 인덴트 제거";
    assertEquals("개행을 기준으로 양쪽 공백 및 인덴트 제거\n개행은 지워지지 않음", text.stripLeading());
    // stripTrailing omitted..
}
```

-   **Collection to Array 추가**


```java
@Test
void toArray() {
    List<String> list = List.of("a", "b", "c");
    String[] expected = {"a", "b", "c"};

    String[] strArrayByStream = list.stream().toArray(String[]::new);
    String[] strArrayByMethod = list.toArray(String[]::new);

    assertArrayEquals(expected, strArrayByStream);
    assertArrayEquals(expected, strArrayByMethod);
}
```

-   **Nestmate Reflection API**  
    Reflection API 사용 시 발생하던 중첩 객체의 private method 접근 에러가 허용되도록 수정

-   **javac 생략 가능**   
    CLI에서 javac 명령어 없이 java Sample.java를 입력함으로써 실행할 수 있도록 변경

-   **Dynamic Class-File Constants 추가**  
    동적으로 생성되는 상수(부트스트랩 메서드를 통한 결과 값)에 대한 생성 비용을 감소시키기 위해 invokedynamic에게 위임되는 constantdynamic과 Constant pool이 추가

-   **ARM64, Aarch64에서의 String, Array 내장 함수 최적화 및 Java.lang, Math의 sin, cos, log method 내장 함수 구현 (성능 개선)**



### **Java 12 (2019년 9월 지원 종료)**

-   **Switch Expression 추가**  
    break 생략, 조건 별 행위를 Lambda로 정의 가능, default 없을 시 컴파일 에러 발생

```java
@Deprecated
public String switchExpressionViaBreak(int number) {  
    String result = switch (number) {
        case 1:
        case 2:
             break "one or two"; // JDK13부터 break으로 값을 반환하지 않고 yield로 반환합니다.
        case 3:
            break "three";
        case 4:
        case 5:
        case 6:
            break "four or five or six";
        default:
            break "unknown";
    };
    return result;
}
```

> JDK13부터는 위 코드처럼 break로 값을 반환하는 문법은 더이상 사용할 수 없다. yield로 반환해야 한다.

```java
public String switchExpressionViaLambda(int number) {
    String result = switch (number) {
        case 1, 2 -> "one or two";
        case 3 -> "three";
        case 4, 5, 6 -> "four or five or six";
        default -> "unknown";  // if not contains, compile error
    };
    return result;
}
```

-   **File NIO API 파일 일치 여부 기능 추가**  
    mismatch 메서드 추가

```java
long position = Files.mismatch(Path path1, Path path2); // 다른 값을 만난 최초의 인덱스 반환
```

-   **String API 메서드 추가**  
    indent, transform 메서드 추가

```java
@Test
void indent() {
    String text = "들여쓰기가 없는 문자열";
    String expectedFirst = "   들여쓰기가 없는 문자열\n"; // 마지막 개행은 자동으로 정규화된다.

    String someParagraph = "여러 단락으로\n이루어진\n문자열";
    String expectedSecond = "   여러 단락으로\n   이루어진\n   문자열\n";

    assertEquals(expectedFirst, text.indent(3));
    assertEquals(expectedSecond, someParagraph.indent(3));
}
```

```java
@Test
void transform() {
    String numberString = "\n1234532  ";
    Integer number = numberString
            .transform(String::strip)
            .transform(Integer::parseInt);

    assertEquals(1234532, number);
}
```

-   **Stream API 메서드 추가**  
    2개의 다운스트림으로 응답을 받아 결과를 병합할 수 있는 Collectior.teeing() 메서드 추가

```java
@Test
void teeingTest() {
    Long collect = Stream.of(1, 2, 3, 4, 5, 6)
            .collect(teeing(
                    summingInt(i -> i),  // 각 요소의 합 중개 연산 (21)
                    counting(),          // 요소의 개수 중개 연산 (6)
                    (sum, n) -> sum + n));  // 두 다운스트림을 최종 연산

    assertEquals(27, collect);
}
```

-   **CompactNumberFormat API 추가**   
    생성 시 전달받은 Locale 정보에 맞게 입력된 숫자를 간결한 형식으로 반환하는 Number Formatter 추가

---

### **Java 13 (2020년 3월 지원 종료)**

-   **Switch Expression 개선**  
    Case 안에서 값을 반환하는 yield keyword가 추가(JDK12의 break 값 반환은 더 이상 사용되지 않는다.)

```java
public String switchExpressionViaBreak(int number) {
    String result = switch (number) {
        case 1:
        case 2:
             yield "one or two";
        case 3:
            yield "three";
        case 4:
        case 5:
        case 6:
            yield "four or five or six";
        default:
            yield "unknown";
    };
    return result;
}
```

-   **Text Block**  
    여러 줄로 구성된 String literal을 """ ~ """로 묶을 수 있는 기능 추가  
    해당 기능은 literal로 작성하는 Query 구문에 효과적으로 사용될 수 있음

```java
@Test
void text_block() {
    String block = """
            안녕하세요. 저는 류장욱입니다.
                특별한 유니코드 \\t, \\n, \\s 등의 문자들이 필요가 없습니다.
            하지만 위의 문자들을 텍스트 블록에 포함해서 사용할수도 있습니다.
            마지막엔 항상 개행이 들어갑니다.
            \t\s\n
            """;

    String expected = "안녕하세요. 저는 류장욱입니다.\n" +
            "    특별한 유니코드 \\t, \\n, \\s 등의 문자들이 필요가 없습니다.\n" +
            "하지만 위의 문자들을 텍스트 블록에 포함해서 사용할수도 있습니다.\n" +
            "마지막엔 항상 개행이 들어갑니다.\n" +
            "\t\s\n\n";

    assertEquals(expected, block);
}
```

-   **ZGC: Uncommit Unused Memory (JEP 351), Heap 최대 크기 향상**  
    사용되지 않는 Heap Memory 공간을 OS에게 반환하는 기능이 포함(최소 크기에 도달하기 전까지 Heap Memory 반환)  
    지원하는 최대 Heap size가 4TB에서 16TB로 향상

-   **Reimplement the Legacy Socket API (JEP 353)**   
    java.net.Socket 및 java.net.ServerSocket API의 기본 구현체를 NioSocketImpl로 변경

-   **java.nio API 메서드 추가**  
    FileSystem.newFIleSystem() 메서드 추가

---

### **Java 14 (~2020년 9월 지원 종료)**

-   **Switch Expression 사용 가능 (정식)**
-   **Pattern Matching for instanceof 추가**  
    명시적인 Casting 없이도 typecasting 할 수 있는 기능 preview

기존의 instanceof 캐스팅

``` java
if (animal instanceof Cat) {
    Cat cat = (Cat) animal;
    cat.meow();
   // other cat operations
} else if (animal instanceof Dog) {
    Dog dog = (Dog) animal;
    dog.woof();
    // other dog operations
}
```

변경된 instanceof 캐스팅

``` java
if (animal instanceof Cat cat) {
    cat.meow();
} else if(animal instanceof Dog dog) {
    dog.woof();
}
```

-   **Record 추가**  
    DTO, VO 패턴의 POJO에서 발생하는 지속적인 boilerplate를 줄이기 위해 record type 추가    
    정식 지원이 시작되는 <u>JAVA16에서 추가 설명</u>

-   **Helpful NullPointerExceptions**  
    Stack trace에 표시되는 NPE 발생 행의 어떤 값이 Null인지 지적하는 기능 추가(NPE가 친절해짐)  
    JAVA14는 기능을 활성화 함으로써 사용 가능(JAVA15부터 Default)


기존의 NPE message

```java
Exception in thread "main" java.lang.NullPointerException
  at com.example.npe.HelpfulNullPointerException.main(HelpfulNullPointerException.java:10)
```

변경된 NPE message

```java
Exception in thread "main" java.lang.NullPointerException: 
  Cannot invoke "String.toLowerCase()" because the return value of 
"com.example.npe.HelpfulNullPointerException$PersonalDetails.getEmailAddress()" is null
  at com.example.npe.HelpfulNullPointerException.main(HelpfulNullPointerException.java:10)
```

```java
Cannot invoke "String.toLowerCase()" because the return value of "getEmailAddress()" is null
```

-   **ZGC on Windows and macOS**   
    Windows, macOS에서도 ZGC 사용 가능

-   **NUMA-Aware Memory Allocation for G1**  
    G1 GC도 Non-uniform memory access를 인식하도록 변경

-   **ParallelScavenge + SerialOld GC 방식 제거, Concurrent Mark Sweep(CMS) Garbage Collector 제거**

---

### **Java 15 (2021년 3월 지원 종료)**

-   **ZGC, Shenandoah GC 사용 가능 (정식)**
-   **Text Block 사용 가능 (정식)**
-   **Helpful NullPointerExceptions** **(기본 지원)**
-   **Record 개선**  
    Record에 대한 2차 preview로써 Reflection 등으로 Field 수정 불가  
    Native Method를 사용하지 못하도록 변경

-   **Sealed Classes 추가**  
    접근 제어자 이외에도 상속에 대한 세분화된 제어를 위해 Sealed Classes가 preview  
    Sub class로 지정할 Type을 permits를 통해 명시적으로 정의, 유한한 계층 구조를 강제하기 위해 적용된 기능 (무분별한 상속 방지)  
    정식 지원이 시작되는 <u>JAVA17에서 추가 설명</u>


-   **Hidden Classes 추가**  
    동적 클래스의 비효율적인 Memory 사용량 등을 개선하기 위해 Hidden Classes가 preview로 추가  
    코드에서 직접적으로 접근할 수 없으며 독립적으로 Unload 할 수 있어 필요한 순간에서만 사용하고 GC 시킬 수 있다고 한다.

> [JEP Spec](https://openjdk.java.net/jeps/371)이나 다른 문서 찾아봐도 구체적으로 이해가 잘 안되서 혹시 구체적인 동작 원리를 알게 되신 분은 좀 알려주시면 감사하겠습니다.

-   Java 15부터 Lambda 기능을 수행하기 위해 만들어지는 Instance는 익명 클래스에서 히든 클래스로 변경

-   **Reimplement the Legacy Socket API**  
    DatagramSocket API 재작성

---

### **Java 16 (2021년 9월 지원 종료)**

-   **Pattern Matching for instanceof 사용 가능 (정식)**
-   **Record 사용 가능 (정식)**

Record는 엄격한 형식을 가지고 있는 Immutable class다.

간단한 특징을 설명하면,

-   선언한 각 필드는 private final 이다.
-   기본 생성자는 없다. 반드시 인스턴스를 만들 때 전체 필드를 초기화시켜야 한다.
-   getter, RequiredAllArgsConstructor, equals, hashcode, toString이 autu-generating된다(setter가 없다).
-   getter도 getXxx()가 아닌 xxx()로 호출한다.

```java
public record Person(Name name, Age age) {
    public boolean sameAs(Person anotherPerson) {
        return this.name.SameAs(anotherPerson.name()) && this.age.sameAs(anotherPerson.age());
    }
    public Person updateName(Name name) {
        return new Person(name, this.age);
    }

    public Person updateAge(Age age) {
        return new Person(this.name, age);
    }
```

흔히, VO, DTO를 사용하면서 필요로 할 때 setter를 사용해서 무분별하게 값을 변경하는 좋지 못한 형식이 보인다.

무분별한 값의 변경과 의미와 목적이 없는 setterXxx 이름으로 여러 레이어에서 쉽게 값이 변경되어 코드 흐름을 방해하고, 다른 개발자는 로직의 목적과 의미를 이해할 수 없는 상황이 많이 생긴다.

record class는 애초부터 setter 설정을 할 수 없어서 위로부터 발생하는 별칭 문제(참조 이동) 및 사이드 이펙트를 예방할 수 있게 된다.

특히, TDD, DDD에서 많이 언급되는 값 객체(VO) 모델을 만들 때 사용하면 아주 큰 도움될 것 같다.

-   **Sealed Classes 개선**  
    sealing , non-sealed keyword를 abstract, extends와 유사한 JVM이 인식 가능한 Context keyword로 허용되었으며, Type check 나 Sealed Classes의 Sub Class를 만드는 기능이 제한됨

-   **foreign linker API 추가**  
    JNI를 대체하기 위한 Host System의 Code에 Access 하는 방법인 foreign linker API 추가

-   **Invoke Default Methods From Proxy Instances (JDK-8159746)**  
    Dynamic proxy 정의 시 interface의 default method를 호출할 수 있는 java.lang.reflect.InvocationHandler 추가

-   **Day Period Support (JDK-8247781)**  
    DateTimeFormatter에 사용할 수 있는 새로운 기호가 추가

```java
LocalTime date = LocalTime.parse("15:25:08.690791");
DateTimeFormatter formatter = DateTimeFormatter.ofPattern("h B");
assertThat(date.format(formatter)).isEqualTo("3 in the afternoon");
```

-   **Add Stream.toList Method (JDK-8180352)**  
    boilerplate를 줄이기 위해 도입된 기능으로 .collect(Collectors.toList()); 와 같은 collect 종결 연산 대신 toList()를 사용할 수 있음

```java
assertEquals(list.stream().collect(toList()), list.stream().toList());
```

-   **Vector API (JEP-338) 추가**  
    스칼라 연산보다 더 최적화된 벡터 연산 방식을 제공하기 위한 API로 Experimental Feature 상태


-   **Strongly Encapsulate JDK Internals by Default**  
    JDK 내부를 직접 접근하는 모든 Library가 접근할 수 없도록 내부 코드가 강하게 Encapsulate



### **Java 17 (LTS, 2029년 9월)**

-   **Sealed Classes 사용 가능 (정식)**

Sealed는 상속하거나(extends), 구현(implements)할 클래스를 지정해두고 해당 클래스들만 상속 혹은 구현을 허용(permits)하는 키워드이다.

해당 키워드를 통해 무분별한 확장을 방지할 수 있고, 키워드 자체로서 해당 클래스나 인터페이스 자체의 명세가 될 수 있다.

permits으로 열린 하위 클래스들은 반드시 `sealed`, `non-sealed`, `final`키워드를 붙여서 사용해야 된다.

-   `sealed`: 하위 클래스가 또 다른 특정 하위 클래스에게 상속 및 구현해줘야 할 때 (또 다시 permits를 붙여야 한다.)
-   `non-sealed`:  하위 클래스가 특정한 하위 클래스가 아닌 모든 클래스에게 상속 및 구현을 허용하고 싶을 때
-   `final`: 하위 클래스가 상속받을 마지막 클래스로 만들고 싶을 때

non-selaed로 인해서 sealed class의 목표가 상실됐다고 생각할 수 있지만, sealed는 강제적으로 제한하는 것에 초점을 둔 것이 아니라 무분별한 확장을 막기 위한 것에 초점을 둔 것이기 때문에 위의 키워드를 통해 확장에 열려있을 수 있도록 설계한 것으로 예상된다.

```java
public sealed interface FoodBrand permits Nongsim, Samyang, Orion {
    String getBrandName();
}
```

```java
public non-sealed class Samyang implements FoodBrand {
    @Override
    public String getBrandName() {
        return "samyang";
    }
}
```

```java
public class FoodBrandFactory {

    public static String getBrandName(@NonNull FoodBrand brand) {
        if(brand instanceof Nongsim nongsim) {
            return nongsim.getBrandName();
        }
        else if(brand instanceof Samyang samyang){
            return samyang.getBrandName();
        } else {
            return brand.getBrandName();
        }
    }
}
```

-   **Restore Always-Strict Floating-Point Semantics (JEP 306)**   
    엄격하고 일관적인 부동 소수점 연산 기능을 제공

-   **Enhanced Pseudo-Random Number Generators (JEP 356)**  
    Stream API 같은 사용 사례들을 지원하기 위한 새로운 Number Generator interface와 instance 추가  
    java.util.Random, SplittableRandom 및 SecureRandom은 RandomGenerator interface를 확장하도록 변경

-   **Strongly Encapsulate JDK Internals 개선 (JEP 403)**  
    이전 버전에서 –illegal-access flag를 사용했을 때 접근 가능했던 우회 요소를 제거함으로써 좀 더 강력한 Encapsulate of JDK를 제공

-   **Pattern Matching for Switch (JEP 406)**  
    Pattern Matching 기능을 Switch에도 확장하기 위한 preview


-   **Vector API (JEP-414) 개선**
-   **RMI Activation API 제거 (JEP 407)**

---

정리한 내용을 다시 읽어보면 문법적으로 Kotlin에서 지원하는 기능들이 추가가 되었고, 추가된 메서드들이 기존에 사용하던 일반적인 로직을 명시적으로 표현했다는 걸 새삼 느끼게 된다. (replace 대신 strip, string에 대한 여러 절차에 거치는 수정이 있는 경우 transform)

JAVA18은 2022년 3월 정식 릴리즈 되었고, JAVA19도 2022년 9월 정식 릴리즈 계획이 잡혀있는데, 추후에 새로운 LTS가 나오게 된다면 재정리하겠습니다. (~사실 JAVA18까지 정리했는데, 지운 건 함정)~

핵심이 될 것 같은 이슈들

-   Reflection API의 일부 로직 재작성
-   안정성과 보안에 큰 결함을 일으킬 수 있는 소멸자 finalize() 제거 (try-with-resources, Cleaner API로 대체)
-   문자집합 UTF-8로 변경

## Reference

[https://lob-dev.tistory.com/82](https://lob-dev.tistory.com/82)

[https://www.baeldung.com/](https://www.baeldung.com/)

[https://openjdk.org/jeps](https://openjdk.org/jeps)

[https://marrrang.tistory.com/82](https://marrrang.tistory.com/82)

---


틀린 점이나 보충해주실 점이 있다면 지적해주시길 바랍니다.
