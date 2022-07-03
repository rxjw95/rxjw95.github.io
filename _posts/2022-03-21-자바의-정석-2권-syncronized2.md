---

title: 자바의 정석 3권 - synchronization(1)
excerpt: 다시보는 자바의 정석 3판
categories: [java, book]
tags: [essential]

---

### Lock과 Condition를 이용한 동기화

앞선 포스팅에서 기아 현상과 경쟁 상태로 인한 요리사와 손님 예시의 문제점을 발견했다.

그렇게 우리는 Cook thread와 Customer thread를 구분하는 waiting thread를 만들어야 한다.

이 때 우리는 `lock 클래스`(java.util.concurrent.locks, JDK1.5)를 사용한다.

Lock에는 3가지 종류가 있는데,
- `ReentrantLock`: 재진입이 가능한 lock, 가장 일반적인 배타 lock
- `ReentrantReadWriteLock`: 읽기에는 공유적이고, 쓰기에는 배타적인 lock
- `StampedLock`: ReentrantReadWriteLock + 낙관적 lock

`ReentrantLock`은 wait/notify와는 같은 기능을 하지만 `Condition`으로 경쟁 풀의 대상을 구분해줄 수 있다.

`ReentrantReadWriteLock`은 읽기 lock을 가지고 있는 상황에서 다른 스레드가 읽기 lock을 중복해서 얻어 읽기를 수행할 수 있다. (상태 변화가 없기 때문에 side effect가 발생할 우려가 없다.)

`StampedLock`은 읽기 lock을 가지고 있는 상황에서 다른 스레드가 쓰기 lock을 하면 읽기 lock이 풀려버린다. 이때 읽기가 <u>실패하면</u>, 읽기 lock을 다시 얻는다.
**읽기 lock에 대해 쓰기 lock을 완전히 배타적인 것이 아닌, 충돌이 발생했을 때만 쓰기 lock 이후에 읽기 lock을 얻게 된다.**

다음은 요리사와 손님을 ReentrantLock으로 변경한 예시 코드이다.

```java
class Customer implements Runnable {
    private final Table table;
    private final String dish;

    Customer(Table table, String dish) {
        this.table = table;
        this.dish = dish;
    }

    @Override
    public void run() {
        while (true) {
            try {
                Thread.sleep(100);
            } catch (InterruptedException e) {
            }
            String threadName = Thread.currentThread().getName();
            table.remove(this.dish);
            System.out.printf("%s is ate a %s \n", threadName, this.dish);
        }
    }
}

class Cook implements Runnable {
    private final Table table;

    Cook(Table table) {
        this.table = table;
    }

    @Override
    public void run() {
        while (true) {
            String[] distribution = table.getDistribution();
            int index = (int) (Math.random() * distribution.length);
            table.add(distribution[index]);
            try {
                Thread.sleep(10);
            } catch (InterruptedException e) {
            }
        }
    }
}

class Table {
    private final String[] distribution = {"donut", "donut", "burger"};
    private final int MAX_DISHES_SIZE = 6;
    private List<String> dishes = new ArrayList<>();

    private ReentrantLock lock = new ReentrantLock();
    private Condition forCook = lock.newCondition();
    private Condition forCustomer = lock.newCondition();

    public void add(String dish) {
        lock.lock();
        
        try {
            while (dishes.size() >= MAX_DISHES_SIZE) {
                String threadName = Thread.currentThread().getName();
                System.out.printf("최대 개수 도달. %s is waiting.\n", threadName);

                try {
                    forCook.await();
                    Thread.sleep(500);
                } catch (InterruptedException e) {}
            }
            dishes.add(dish);
            forCustomer.signal();
            System.out.println("dishes: " + dishes);
        } finally {
            lock.unlock();
        }
    }

    public void remove(String dish) {
        lock.lock();
        String threadName = Thread.currentThread().getName();
        try {
            while (dishes.size() == 0) {
                System.out.printf("음식 소진. %s is waiting.\n", threadName);
                try {
                    forCustomer.await();
                    Thread.sleep(500);
                } catch (InterruptedException e) {}
            }

            while(true) {
                for(int i = 0; i < dishes.size(); i ++) {
                    if(dish.equals(dishes.get(i))) {
                        dishes.remove(i);
                        forCook.signal();
                        return;
                    }
                }

                try {
                    System.out.printf("원하는 음식 없음. %s is waiting.\n", threadName);
                    forCustomer.await();
                    Thread.sleep(500);
                } catch (InterruptedException e) {}
            }
        } finally {
            lock.unlock();
        }
    }

    public String[] getDistribution() {
        return distribution;
    }
}

public class ReentrantLockPractice {
    public static void main(String[] args) throws InterruptedException {
        Table table = new Table();

        new Thread(new Cook(table), "COOK").start();
        new Thread(new Customer(table, "burger"), "CUSTOMER1").start();
        new Thread(new Customer(table, "donut"), "CUSTOMER2").start();
        new Thread(new Customer(table, "donut"), "CUSTOMER3").start();
        new Thread(new Customer(table, "donut"), "CUSTOMER4").start();
        new Thread(new Customer(table, "burger"), "CUSTOMER5").start();

        Thread.sleep(2000);
        System.exit(0);
    }
}

```

### volatile
멀티 코어 프로세서는 각 코어마다 별도의 캐시가 존재한다.

코어는 메모리에서 읽어온 값을 캐시에 저장하고 캐시에서 값을 읽어서 작업한다. 

다시 같은 값을 얻을 때는 먼저 캐시에서 확인해서 hit되면 해당 값을 가져와서 사용한다. (hit되지 않으면 메모리에서 읽고 동기화)

그러다보니 메모리에 저장된 값과 캐시에 저장된 값이 동기화가 되지 않아서 실제로 원하는 값이 아닌 경우가 있다.

이때 `volatile` 키워드를 사용하면, 변수의 값을 가져올 때 캐시가 아닌 메모리에서 읽어오기 때문에 캐시와 메모리간의 불일치성을 해결할 수 있다.

변수에 volatile 키워드를 붙이는 대신 synchronized 키워드를 사용해도 같은 효과를 볼 수 있다.

> synchronized 블럭을 들어갈 때와 나갈 때, 캐시와 메모리간의 동기화가 이루어진다.


#### volatile로 long과 double을 원자화
JVM은 데이터를 4byte(32bit) 단위로 읽어들인다. 4byte 이하의 데이터들은 한 번에 읽기나 쓰기가 가능하다. (내부 명령어가 더이상 나눌 수 없는 최소 작업 단위이므로)
그렇기 때문에 작업의 중간이라는 개념이 없기 때문에 다른 스레드가 끼어들 일이 없다.

하지만, 그 이상의 타입은 여러 명령어의 집합으로 읽거나 쓰기가 가능하다. 그렇기에 다른 스레드가 명령어 중간에 끼어들 여지가 있다.

이러한 문제를 해결하기 위해서 변수를 읽고 쓰는 메서드 로직을 synchronized로 묶을 수 있지만, 아래처럼 변수 선언부에 volatile 키워드를 사용하는 것이 좋다.

```java
volatile long shared; // atomic
```

위의 변수는 이제 읽기/쓰기 과정이 원자화가 된다. 그렇기에 더이상 작업을 나눌 수 없기 때문에 스레드 안전성을 보장한다.

synchronized도 이러한 개념을 적용해서 동기화를 구현한 것인데, 그렇다고 해서 원자화가 동기화라고 할 수는 없다.

---

틀린 점이나 보충해주실 점이 있다면 지적해주시길 바랍니다.
