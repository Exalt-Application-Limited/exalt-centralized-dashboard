public class TestJava {
    public static void main(String[] args) {
        System.out.println("Java is working correctly!");
        System.out.println("Java Version: " + System.getProperty("java.version"));
        System.out.println("Java Home: " + System.getProperty("java.home"));
        
        // Test memory allocation
        try {
            byte[] test = new byte[10 * 1024 * 1024]; // 10MB
            System.out.println("Successfully allocated 10MB of memory");
        } catch (OutOfMemoryError e) {
            System.out.println("Memory allocation failed: " + e.getMessage());
        }
    }
}
