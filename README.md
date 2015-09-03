# chiasm-layout

Nested box layout for Chiasm components.

![Boxes](http://curran.github.io/images/visEditor/boxes.png)

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

The following features are also present:

 * Specifying relative (proportions to siblings) or absolute (fixed number of pixels) size of any node in the layout tree. Relative size makes sense for resizable visualizations, while absolute size makes sense for conventional UI widgets that only look good at a specific size in terms of pixels.
 * Toggling visibility of components. When a component is marked as "hidden", it is excluded from the layout algorithm. This could be used to, for example, hide and show the JSON configuration editor when the user clicks on a "settings" button.
