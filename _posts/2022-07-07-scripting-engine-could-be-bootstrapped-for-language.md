---

title: HV000170: No JSR-223 scripting engine could be bootstrapped for language
excerpt: JDK17 마이그레이션 중 발견한 호환성 문제  
categories: [java]
tags: [error]

---
## 개발 환경

-   spring boot-2.6.6
-   jdk17

## 상황

JDK 17 버전업 후 다음과 같은 에러 발생

```
javax.validation.ConstraintDeclarationException: HV000170: No JSR-223 scripting engine could be bootstrapped for language "javascript".
at com.sds.promise.workflow.model.request.WorkflowNodeRequestTest$progress.givenToDoAndProgress0(WorkflowNodeRequestTest.java:37)
	Caused by: org.hibernate.validator.spi.scripting.ScriptEvaluatorNotFoundException: HV000232: No JSR 223 script engine found for language "javascript".
		at com.sds.promise.workflow.model.request.WorkflowNodeRequestTest$progress.givenToDoAndProgress0(WorkflowNodeRequestTest.java:37)
```

## 문제 해결

### 원인

-   validation annotation 중 @ScriptAssert 은 Java Scripting API의 스크립팅 언어를 지원해주는 기능을 사용하고 있음
-   JVM Engine의 변경으로 인한 Java Scripting API 미호환
-   JDK8 ~ JDK14 = **NashornVM**
-   JDK15 ~ JDK17 = **GraalVM**

### 조치 방법

1. GraamVM 가이드에서 Nashorn 호환 모드 지원 (부득이한 경우에만 사용)

[https://github.com/graalvm/graaljs/blob/master/docs/user/NashornMigrationGuide.md](https://github.com/graalvm/graaljs/blob/master/docs/user/NashornMigrationGuide.md)

2. @ScriptAssert 제거, 및 @Valid 및 try/catch로 검증

3. Nashorn 의존성 추가

```xml
<dependency>
	<groupId>org.openjdk.nashorn</groupId>
	<artifactId>nashorn-core</artifactId>
	<version>15.3</version>
</dependency>
```

## 결과

`@ScriptAssert`를 제거하고 각 Controller 단에서 예외 로직 작성

## 참고

[Java Scripting API: GraalVM 적용해보기](https://madplay.github.io/post/call-javascript-function-from-java-using-graalvm)

---

틀린 점이나 보충해주실 점이 있다면 지적해주시길 바랍니다.
