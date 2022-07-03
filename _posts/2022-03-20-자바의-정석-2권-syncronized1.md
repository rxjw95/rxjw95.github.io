---

title: 자바의 정석 3권 - synchronization(1)
excerpt: 다시보는 자바의 정석 3판
categories: [java, book]
tags: [essential]

---

## Thread synchronization

멀티 스레드 환경에서 공유 자원에 대한 레이스 컨디션으로 인해 예측치 못한 결과를 얻게 되는 문제가 발생한다.
이러한 일을 방지하기 위해 한 스레드가 특정 작업을 끝마치기 전까지 다른 스레드로 인해 작업에 영향을 방해받지 않도록 해야 한다.

이렇게 도입된 개념이 바로 `임계 영역(Critical Section)`과 `잠금(Lock)`이다.

공유 데이터를 사용하는 코드 영역을 임계 영역으로 지정해놓고, 해당 영역에 접근할 수 있는 락을 획득한 스레드만 코드 영역 내의 작업을 수행할 수 있게 한다.

이처럼 한 스레드가 진행 중인 작업을 다른 스레드가 간섭하지 못하도록 막는 것을 스레드 동기화라고 한다.

### synchronized를 이용한 동기화

`synchronized` 키워드를 사용해서 임계 영역을 지정할 수 있다. 

키워드를 선언하는 위치는 
1. 메서드 앞에 키워드를 붙여 메서드 전체를 임계 영역으로 지정하는 방법
2. 메서드 내의 코드 일부를 synchronized (락을 걸고자 하는 객체 참조) {} 로 묶는 방법 (효율적)

두 번째 방법이 효율적인 이유는 메서드 로직의 일부만 공유 자원을 변경하는 상황이라고 가정하면, 우리는 메서드 전체를 동기화시키는 것보다 임계 영역 이전까지의 로직은 처리하고 임계 영역만 보호하는 것이 효율적이다.

다음은 유명한 돈을 인출하는 예시 코드이다.

```java
public class SynchronizedPractice {
    public static void main(String[] args) {
        Runnable accountRunnable = new AccountRunnable();
        new Thread(accountRunnable).start();
        new Thread(accountRunnable).start();
    }
}

class Account {
    private int balance = 1000;

    /*public synchronized void withDraw(int money) {
        if(balance >= money) {
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            balance -= money;
        }
    }*/

    public void withDraw(int money) {
        synchronized (this) {
            if(balance >= money) {
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                balance -= money;
            }
        }
    }

    public int getBalance() {
        return balance;
    }
}

class AccountRunnable implements Runnable {
    private final Account account = new Account();

    @Override
    public void run() {
        while(account.getBalance() > 0) {
            int money = (int) (Math.random() * 3 + 1) * 100;
            account.withDraw(money);
            System.out.println(account.getBalance());
        }
    }
}

```

### wait, notify

`syncronized`로 공유 데이터를 보호하게 된 건 좋다. 하지만, 특정 스레드가 객체의 락을 가진 상태로 특정 상태를 위해 대기를 하게 되면 무한 대기 현상이 발생할 것이다.

이러한 상황을 개선하기 위해 `wait()`과 `notify()` 메서드가 있다.

wait()은 동기화된 임계 영억 코드를 수행하다가 작업을 진행할 수 있는 상황이 아니라면, wait()를 호출하여 스레드가 락을 반납하고 thread waiting pool로 들어가게 된다.
그 후, 다른 스레드가 락을 얻어 해당 객체에 대한 작업을 수행할 수 있게 된다. 
<br>
나중에 작업을 진행할 수 있는 상황이 되면 notify()로 작업을 중단했던 스레드가 다시 락을 얻어 작업을 진행할 수 있게 된다.

> wait()로 lock을 반납했다가, 다시 lock을 얻어 임계 영역에 들어오는 것을 재진입(re-entrance)라고 한다.

하지만, 이때 기억해야할 것이 두 가지가 있다.
1. notify()를 호출하면 waiting pool에서 <u>임의의</u> 스레드만 통보받는다. 즉, 오래 기다린 스레드가 락을 얻는다는 보장은 없다.
2. waiting pool은 객체마다 존재하는 것이며, notifyAll()이 호출된다해서 모든 객체의 waiting pool에 있는 스레드가 깨어나는 것이 아니다.

다음은 테이블의 음식을 제공하는 요리사와 음식을 먹는 손님 예시 코드이다.

```java
public class WaitNotifyPractice {
    public static void main(String[] args) throws InterruptedException {
        Table table = new Table();

        new Thread(new Cook(table), "COOK1").start();
        new Thread(new Customer(table, "donut"), "CUST1").start();
        new Thread(new Customer(table, "burger"), "CUST2").start();
        new Thread(new Customer(table, "burger"), "CUST3").start();
        new Thread(new Customer(table, "burger"), "CUST4").start();
        new Thread(new Customer(table, "donut"), "CUST5").start();
        new Thread(new Customer(table, "donut"), "CUST6").start();

        Thread.sleep(2000);
        System.exit(0);
    }
}

class Customer implements Runnable {
    private final Table table;
    private final String food;

    Customer(Table table, String food) {
        this.table = table;
        this.food = food;
    }

    @Override
    public void run() {
        while (true) {
            try {
                Thread.sleep(100);
            } catch (InterruptedException e) {
            }
            String threadName = Thread.currentThread().getName();

            table.remove(food);
            System.out.println(threadName + " ate a " + food);
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
            String[] dishDistribution = table.getDishDistribution();
            int index = (int) (Math.random() * dishDistribution.length);
            table.add(dishDistribution[index]);

            try {
                Thread.sleep(10);
            } catch (InterruptedException e) {
                ;
            }
        }
    }
}

class Table {
    private final String[] dishDistribution = {"donut", "donut", "burger"}; // 음식이 나올 확률을 donut이 더 높도록 한다.
    private final int MAX_FOOD = 6;
    private final ArrayList<String> dishes = new ArrayList<>();

    public synchronized void add(String dish) {
        if (dishes.size() >= MAX_FOOD) {
            return;
        }
        dishes.add(dish);
        System.out.println("현재 나온 음식: " + dishes);
    }

    public void remove(String dishName) {
        synchronized (this) {
            String threadName = Thread.currentThread().getName();
            while (dishes.size() == 0) {
                System.out.println("음식 소진. " + threadName + " is waiting");
                try {
                    wait();
                    Thread.sleep(500);
                } catch (InterruptedException e) {
                    ;
                }
            }

            while (true) {
                for (int i = 0; i < dishes.size(); i++) {
                    if (dishName.equals(dishes.get(i))) {
                        dishes.remove(i);
                        notify();
                        return;
                    }
                }

                try {
                    System.out.println("원하는 음식이 없음." + threadName + " is waiting.");
                    wait();
                    Thread.sleep(500);
                } catch (InterruptedException e) {
                    ;
                }
            }
        }
    }

    public String[] getDishDistribution() {
        return this.dishDistribution;
    }
}

```

---

틀린 점이나 보충해주실 점이 있다면 지적해주시길 바랍니다.
