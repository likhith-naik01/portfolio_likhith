// import java.util.Scanner;

// public class Account1 {
//     int accno;
//     String name;
//     long phone;
//     int balamt;


//     public void  createAccount(int accno,String name ,long phone,int initialD){
//         this.accno=accno;
//         this.name=name;
//         this.phone=phone ;
//         this.balamt=initialD;
//     }

//     public void deposit(int amount) {
//         if (amount >0)
//            balamt+=amount;
//            System.out.println("theh balance amount ");

//     }

//     public void withdraw(int wamount){
//         if (balamt>wamount)
//            balamt-=wamount;
//            System.out.println("theh balance amount "+balamt);
//     }


//     public void display(){
//         System.out.println("the balance amount "+balamt);
//         System.out.println("the balance amount "+accno);
//         System.out.println("the balance amount "+name);
//         System.out.println("the balance amount "+phone);
//     }
  

//     public static void main(String[] args){
//         Scanner sc = new Scanner (System.in);
//         Account1 account=new Account1();

    
//         System.out.println("enetr the accno");
//         int accno=sc.nextInt();
//         System.out.println("enetr thr name of the accont holder");
//         String name=sc.nextLine();
//         System.out.println("enter the phone number ");
//         long phone=sc.nextLong();
//         System.out.println("enter teh balance amount");
//         int balamt = sc.nextInt();
//         int initialD = sc.nextFloat();
//         account.createAccount(accno,name,phone,initialD);

//         boolean running =true;


//         while (running){
//             System.out.println("enter your choice 1= deposit 2 withdraw  3= display 4= exit");
//             int choice =sc.nextInt();

//            switch(choice){    
//                 case 1:
//                     System.out.println("the amount to deposit ");
//                     int deposit =sc.nextInt();
//                     account.deposit(amount);
//                     break;
                

//                 case 2:
//                     System.out.println("the amount to deposit ");
//                     int withdraw =sc.nextInt();
//                     account.withdraw(wamount);
//                     break;

//                 case 3:
//                     System.out.println(" accont details "); 
//                     account.display();
//                     break;

//                 case 4:
//                     running = false;
//                     break();

//                 default :
//                     System.out.println("you enetred the wrong number");
                    
//            }
//         }
//         sc.close();
//     }
// }





import java.util.Scanner;

public class Account1 {
    int accno;
    String name;
    long phone;
    int balamt;

    public void createAccount(int accno, String name, long phone, int initialD) {
        this.accno = accno;
        this.name = name;
        this.phone = phone;
        this.balamt = initialD;
    }

    public void deposit(int amount) {
        if (amount > 0) {
            balamt += amount;
            System.out.println("Deposit successful. Updated balance: " + balamt);
        } else {
            System.out.println("Invalid deposit amount!");
        }
    }

    public void withdraw(int wamount) {
        if (balamt >= wamount) {
            balamt -= wamount;
            System.out.println("Withdrawal successful. Updated balance: " + balamt);
        } else {
            System.out.println("Insufficient balance!");
        }
    }

    public void display() {
        System.out.println("Account Number: " + accno);
        System.out.println("Account Holder Name: " + name);
        System.out.println("Phone Number: " + phone);
        System.out.println("Balance Amount: " + balamt);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Account1 account = new Account1();

        System.out.println("Enter the account number:");
        int accno = sc.nextInt();
        sc.nextLine(); // Consume newline
        System.out.println("Enter the name of the account holder:");
        String name = sc.nextLine();
        System.out.println("Enter the phone number:");
        long phone = sc.nextLong();
        System.out.println("Enter the initial deposit amount:");
        int initialD = sc.nextInt();

        account.createAccount(accno, name, phone, initialD);

        boolean running = true;

        while (running) {
            System.out.println("Enter your choice: 1=Deposit, 2=Withdraw, 3=Display, 4=Exit");
            int choice = sc.nextInt();

            switch (choice) {
                case 1:
                    System.out.println("Enter the amount to deposit:");
                    int deposit = sc.nextInt();
                    account.deposit(deposit);
                    break;

                case 2:
                    System.out.println("Enter the amount to withdraw:");
                    int withdraw = sc.nextInt();
                    account.withdraw(withdraw);
                    break;

                case 3:
                    System.out.println("Account details:");
                    account.display();
                    break;

                case 4:
                    running = false;
                    System.out.println("Exiting the program...");
                    break;

                default:
                    System.out.println("You entered an invalid choice!");
            }
        }
        sc.close();
    }
}

