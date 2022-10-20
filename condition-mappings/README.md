# Condition Mapping

Use these premade maps in this folder as examples or templates to make your own condition mappings.

## Interface

The map inferface is a record where the condition name matches an array containing:

```
[
 color when condition is added,
 color when condition is removed (optional),
 sound when condition is added (optional),
 sound when condition is removed (optional),
]
```

Example:

```
{
    argh: ["#0"],
    blah: ["#0", "#ff"],
    fear: ["#ff00ff", "#00ff00", "./sounds/dice.wav"]
    confused: ["#ff00ff", "#00ff00", "./sounds/dice.wav", "./sounds/lock.wav"]
}
```
