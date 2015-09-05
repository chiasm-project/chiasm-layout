# chiasm-layout

[![Build
Status](https://travis-ci.org/chiasm-project/chiasm-layout.svg)](https://travis-ci.org/chiasm-project/chiasm-layout)

Nested box layout for [Chiasm](https://github.com/chiasm-project/chiasm) components.

![Boxes](http://curran.github.io/images/visEditor/boxes.png)

The above nested box structure can be configured like this:

```
{
  "orientation": "vertical",
  "children": [
    "A",
    "B",
    {
      "orientation": "horizontal",
      "children": [
        "C",
        "D"
      ]
    }
  ]
}
```

Here's a [complete Chiasm example that uses this
plugin](http://bl.ocks.org/curran/b4aa88691528c0f0b1fa)

The following features are also present:

 * Specifying relative (proportions to siblings) or absolute (fixed number of
   pixels) size of any node in the layout tree. Relative size makes sense for
   resizable visualizations, while absolute size makes sense for conventional UI
   widgets that only look good at a specific size in terms of pixels. To use
   this feature, specify size as a string ending in "px".

 * Toggling visibility of components. When a component is marked as "hidden", it
   is excluded from the layout algorithm. This could be used to, for example,
   hide and show the JSON configuration editor when the user clicks on a
   "settings" button. To use this feature, add `{ hidden : true }` to the
   `sizes` configuration.
