// Source code is decompiled from a .class file using FernFlower decompiler.
class Room {
    String name;
    int age;
 
     public void printInfo(String name){
        System.out.println(name);
    }
    public void printInfo(int age){
        System.out.println(age);
    }
   
 
    public static void main(String[] args) {
       Room mem1=new Room();
       mem1.name="akash";
       mem1.age=19;

       mem1.printInfo(mem1.age);
    }
 }
 