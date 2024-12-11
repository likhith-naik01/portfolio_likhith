/*give teh java program 1.Create a class namely Account with the data members (Accno : integer, name :String, Phone No: integer, balance_amt:float), and following methods :

a. CreateAccount() method to create an account.

b. Deposit() method to deposit amount to an account.

c. Withdraw() method which gets the amount to be withdrawn from his/her account.

d. PrintAccount() method to display account details.*/

import java.util.Scanner;

class Account {
    // Data members
    private int accNo;
    private String name;
    private long phoneNo;
    private float balanceAmt;

    // Method to create an account
    public void createAccount(int accNo, String name, long phoneNo, float initialDeposit) {
        this.accNo = accNo;
        this.name = name;
        this.phoneNo = phoneNo;
        this.balanceAmt = initialDeposit;
        System.out.println("Account created successfully!");
    }

    // Method to deposit amount
    public void deposit(float amount) {
        if (amount > 0) {
            balanceAmt += amount;
            System.out.println("Deposit successful! New balance: " + balanceAmt);
        } else {
            System.out.println("Invalid deposit amount!");
        }
    }

    // Method to withdraw amount
    public void withdraw(float amount) {
        if (amount > 0 && amount <= balanceAmt) {
            balanceAmt -= amount;
            System.out.println("Withdrawal successful! New balance: " + balanceAmt);
        } else if (amount > balanceAmt) {
            System.out.println("Insufficient balance!");
        } else {
            System.out.println("Invalid withdrawal amount!");
        }
    }

    // Method to print account details
    public void printAccount() {
        System.out.println("Account Number: " + accNo);
        System.out.println("Account Holder: " + name);
        System.out.println("Phone Number: " + phoneNo);
        System.out.println("Current Balance: " + balanceAmt);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Account account = new Account();

        // Creating an account
        System.out.println("Enter Account Number: ");
        int accNo = sc.nextInt();
        sc.nextLine();  // Consume the newline character
        System.out.println("Enter Name: ");
        String name = sc.nextLine();
        System.out.println("Enter Phone Number: ");
        long phoneNo = sc.nextLong();
        System.out.println("Enter Initial Deposit: ");
        float initialDeposit = sc.nextFloat();
        account.createAccount(accNo, name, phoneNo, initialDeposit);

        // Perform operations
        boolean running = true;
        while (running) {
            System.out.println("\nChoose operation: ");
            System.out.println("1. Deposit");
            System.out.println("2. Withdraw");
            System.out.println("3. Print Account Details");
            System.out.println("4. Exit");
            int choice = sc.nextInt();

            switch (choice) {
                case 1:
                    System.out.println("Enter amount to deposit: ");
                    float depositAmount = sc.nextFloat();
                    account.deposit(depositAmount);
                    break;
                case 2:
                    System.out.println("Enter amount to withdraw: ");
                    float withdrawAmount = sc.nextFloat();
                    account.withdraw(withdrawAmount);
                    break;
                case 3:
                    account.printAccount();
                    break;
                case 4:
                    running = false;
                    System.out.println("Exiting program...");
                    break;
                    
                default:
                    System.out.println("Invalid choice! Please try again.");
            }
        }
        sc.close();
    }
}

