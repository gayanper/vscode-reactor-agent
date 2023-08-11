# VSCode Reactor Launcher Hooks

This extension provide support to Project Reactor Debug Experience features into reactor project such as Spring WebFlux
projects. The feature are contributed to [Java Debug Extension](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-java-debug). 

## Features
- Add support to enable **"Activating Debug Mode - aka tracebacks"** for project reactor applications.


## Requirements

This extension depends on Redhat Java VSCode Extension

## Extension Settings

This extension contributes the following properties to java launch configuration.

#### Properties
- enableTracebacks  -  Enable Project Reactor traceback feature for current application. Read [more here](https://projectreactor.io/docs/core/release/reference/#debug-activate). When activated the following log can be observed from the java agent that is used to enable this feature.
    ```
    ============== [VSCode Reactor Agent: Install Start] ==============
    19:50:41.780 [main] DEBUG reactor.util.Loggers - Using Slf4j logging framework
    public static void reactor.core.publisher.Hooks.onOperatorDebug()
    19:50:41.788 [main] DEBUG reactor.core.publisher.Hooks - Enabling stacktrace debugging via onOperatorDebug
    Successfully invoked Hooks.onOperatorDebug()
    ============== [VSCode Reactor Agent: Install End] ==============
    ```


## Known Issues

- This extension needs java 1.8 or above to work.

None

## Release Notes

### 0.0.1
- Add support for project reactor **tracebacks** with initial extension implementation.

---

**Enjoy!**
