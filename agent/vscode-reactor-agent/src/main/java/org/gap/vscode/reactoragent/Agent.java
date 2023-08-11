package org.gap.vscode.reactoragent;

import java.lang.instrument.Instrumentation;
import java.lang.reflect.InvocationTargetException;
import java.util.stream.Stream;

public final class Agent {
    private static final String HOOKS_CLASS_NAME = "reactor.core.publisher.Hooks";
    
    private Agent() {
    }
    
    public static void premain(String agentArgs, Instrumentation inst) {
        Class<?> clazz;
        try {
            printHeader();
            clazz = Class.forName(HOOKS_CLASS_NAME);
            Stream.of(clazz.getMethods()).filter(m -> {
                System.out.println(m);
                return "onOperatorDebug".equals(m.getName());
            }).findFirst().ifPresent(m -> {
                try {
                    m.invoke(null);
                    printComplete();
                } catch (IllegalAccessException | IllegalArgumentException | InvocationTargetException e) {
                    printError(e);
                }
            });
            
        } catch (ClassNotFoundException e) {
            printError(e);
        } finally {
            printFooter();
        }
    }
    
    private static void printComplete() {
        System.out.println("Successfully invoked Hooks.onOperatorDebug()");
    }
    
    private static void printError(Exception e) {
        e.printStackTrace();
    }
    
    private static void printHeader() {
        System.out.println("============== [VSCode Reactor Agent: Install Start] ==============");
    }
    
    private static void printFooter() {
        System.out.println("============== [VSCode Reactor Agent: Install End] ==============");
    }
    
}
