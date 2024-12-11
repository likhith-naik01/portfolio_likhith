public class Pen {
    String brand ;
    String color;

    public write(){
        System.out.println("to write ");
    }
    
}
public class OOPS{
    public static void main(String args[]) {
        Pen pen1=new Pen();
        pen1.color="blue ";
        pen1.brand="bright";

        pen1.write();
    }
}