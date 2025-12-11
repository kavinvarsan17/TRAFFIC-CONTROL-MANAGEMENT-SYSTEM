import java.util.*;

class Sensor {
    private int vehicleCount;

    public void detectVehicles() {
        // Randomly simulate vehicle count between 0 and 20
        vehicleCount = new Random().nextInt(21);
    }

    public int getVehicleCount() {
        return vehicleCount;
    }
}

class TrafficSignal {
    private String signalName;
    private int greenTime;
    private int redTime;
    private boolean isGreen;

    public TrafficSignal(String signalName) {
        this.signalName = signalName;
        this.greenTime = 10; // default
        this.redTime = 10;
        this.isGreen = false;
    }

    public void adjustSignal(int trafficDensity) {
        if (trafficDensity > 15) {
            greenTime = 20;
            redTime = 10;
        } else if (trafficDensity > 8) {
            greenTime = 15;
            redTime = 10;
        } else {
            greenTime = 10;
            redTime = 15;
        }
    }

    public void startSignal() {
        isGreen = true;
        System.out.println(signalName + " signal is GREEN for " + greenTime + " seconds.");
        try {
            Thread.sleep(greenTime * 1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        isGreen = false;
        System.out.println(signalName + " signal is RED for " + redTime + " seconds.");
        try {
            Thread.sleep(redTime * 1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    public String getSignalName() {
        return signalName;
    }
}

class EmergencyVehicleDetector {
    private boolean emergencyDetected;

    public void detectEmergency() {
        emergencyDetected = new Random().nextBoolean();
    }

    public boolean isEmergencyDetected() {
        return emergencyDetected;
    }
}

class CentralControlSystem {
    private List<TrafficSignal> signals;
    private Sensor sensor;
    private EmergencyVehicleDetector emergencyDetector;

    public CentralControlSystem() {
        signals = new ArrayList<>();
        sensor = new Sensor();
        emergencyDetector = new EmergencyVehicleDetector();
        signals.add(new TrafficSignal("North"));
        signals.add(new TrafficSignal("East"));
        signals.add(new TrafficSignal("South"));
        signals.add(new TrafficSignal("West"));
    }

    public void startSystem() {
        Scanner sc = new Scanner(System.in);
        System.out.println("=== TRAFFIC CONTROL MANAGEMENT SYSTEM ===");
        System.out.println("Press Ctrl+C to stop simulation.");

        while (true) {
            for (TrafficSignal signal : signals) {
                sensor.detectVehicles();
                int count = sensor.getVehicleCount();
                emergencyDetector.detectEmergency();

                System.out.println("\nSignal: " + signal.getSignalName());
                System.out.println("Vehicle Count: " + count);
                System.out.println("Emergency Vehicle Detected: " + emergencyDetector.isEmergencyDetected());

                if (emergencyDetector.isEmergencyDetected()) {
                    System.out.println("🚨 Emergency vehicle detected! Giving priority...");
                    System.out.println(signal.getSignalName() + " signal turned GREEN immediately for 15 seconds!");
                    try {
                        Thread.sleep(15000);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    continue;
                }

                signal.adjustSignal(count);
                signal.startSignal();
            }
        }
    }
}

public class TrafficControlSystem {
    public static void main(String[] args) {
        CentralControlSystem control = new CentralControlSystem();
        control.startSystem();
    }
}
