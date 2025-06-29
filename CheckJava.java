public class CheckJava {
    public static void main(String[] args) {
        System.out.println("Java Version: " + System.getProperty("java.version"));
        System.out.println("JVM Name: " + System.getProperty("java.vm.name"));
        System.out.println("JVM Version: " + System.getProperty("java.vm.version"));
        System.out.println("JVM Vendor: " + System.getProperty("java.vm.vendor"));
        System.out.println("OS Arch: " + System.getProperty("os.arch"));
        System.out.println("OS Name: " + System.getProperty("os.name"));
        
        // Test memory allocation
        try {
            System.out.println("\nTesting memory allocation...");
            byte[] testArray = new byte[10 * 1024 * 1024]; // Allocate 10MB
            System.out.println("Memory allocation successful");
        } catch (OutOfMemoryError e) {
            System.err.println("Memory allocation failed: " + e.getMessage());
        }
    }
}
