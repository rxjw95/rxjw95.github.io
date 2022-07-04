---

title: 자바의 정석 3권 - Lambda와 Stream(1)
excerpt: 다시보는 자바의 정석 3판
categories: [java, book]
tags: [essential]

---

## 람다식(Lambda expression)
람다식이란 메서드를 하나의 `식(expression)`으로 표현한 것이다. (사실 자바는 익명 클래스를 표현한 것이지만)

나는 expression과 statement를 이해하는 것이 중요하다고 생각한다. 

생각보다 이러한 미묘한 단어 차이(위의 단어들을 비롯해 function과 method도 마찬가지로)가 원론적인 의미를 조금 더 쉽게 이해시켜줄 수 있는 경우가 있다.

이 주제는 따로 포스팅하고 이야기가 새기 전에 JDK1.8을 시작으로 람다식을 지원하게 되었는데, 알아보도록 하자.

### 람다식 만들어보기
자바에서 람다식을 사용하기 위해선 functional interface를 사용해야 한다. 

직접 만들어도 되고, 미리 정의된 함수형 인터페이스 사용해도 되는데, 이번 포스팅은 직접 만들어 보는 것으로 마무리 한다.

첫 번째는 직접 함수형 인터페이스를 만들어서 활용해본다. 다음은 직접 함수형 인터페이스를 만들고 람다식 형태로 구현을 한 예시 코드이다.

```java
@FunctionalInterface
interface Function {
    int sum(int a, int b);
}

public class LambdaPractice {
    public static void main(String[] args) {
        Function func = (a, b) -> a + b;

        System.out.println(func.sum(3, 5)); // result: 8
    }
}
```
보통 `new Fucntion() { ...override }`로 익명 객체를 만들어 내부에서 오버라이드했을 것이다.

하지만, 람다식의 등장으로 우리는 아래의 문법처럼 아주 단순하게 로직을 작성할 수 있게 되었다.

`(param, ...) -> { (return) logic }`

#### 원리

익명 객체를 어떻게 람다식이 대체할 수 있는 이유는 람다식도 사실 `익명 객체`이기 때문이다.

람다식을 소개할 때 지나가듯 적었기도 했지만, 설명을 **메서드를 식으로 표현한 것**이 람다식이라고 했다.

하지만 자바라는 클래스 기반 언어에서 유일하게 메서드만 존재할 수 없기에, 자바는 정확하게 실체화할 익명 객체를 식으로 표현한다는 말이 조금 더 맞다.

그리고 파라미터 타입과 개수 그리고 반환 타입이 일치하기 때문에 컴파일러는 위의 람다식을 매칭할 수 있게 되는 것이다.

> 주의 사항은 하나의 람다식만 대입해서 사용하기 때문에 함수형 인터페이스는 오직 하나의 추상 메서드만 정의되어 있어야 한다.


#### 범위

람다식 내부에서 인스턴스 변수 혹은 지역 변수 모두 접근을 할 수 있지만, 지역 변수의 경우는 `final`이 붙지 않아도 상수로 간주가 된다.
그렇기 때문에 지역 변수를 변경할 수는 없다. 하지만, 인스턴스 변수들은 상수로 간주되지 않기 때문에 값을 변경할 수 있다. 

다음은 값을 변경시키는 예시 코드이다.

```java
@FunctionalInterface
interface Printer {
    void print();
}

class Outer {
    int outerVal = 1;

    class Inner {
        private int innerVal = 2;

        public void print(int param) {
            int localVal = 3;
            Printer printer = () -> {
                System.out.println("outerVal: " + outerVal);
                System.out.println("innerVal: " + innerVal);
                System.out.println("innerVal one increase: " + ++innerVal);
                System.out.println("outerVal one decrease: " + --innerVal);
                System.out.println("localVal: " + localVal); 
                System.out.println("localVal one increase: " + ++localVal); // error 
                System.out.println("param one increase: " + --param); // error 
            };
            printer.print();
        }
    }
}

public class LambdaPractice {
    public static void main(String[] args) {
        Outer outer = new Outer();
        Outer.Inner inner = outer.new Inner();

        inner.print();
        System.out.println(outer.outerVal);
    }
}

```

다음 포스팅은 java.util.function package에 있는 함수형 인터페이스들을 사용해 본다.

---

틀린 점이나 보충해주실 점이 있다면 지적해주시길 바랍니다.
