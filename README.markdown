# TaskPaper.sugar

TaskPaper.sugar adds support for [TaskPaper](http://www.hogbaysoftware.com/products/taskpaper) files in Espresso, along with some actions to make working with them easier:

* **Toggle @done** `control option D`
* **Toggle @today** `control option Y`

Additionally, it will behave the same as the actual TaskPaper app when entering newlines.

TaskPaper syntax highlighting will trigger for documents with the `.taskpaper` extension, or for `.txt` documents that have a TaskPaper-style project in their first line.

## Installation

**Requires Espresso 2.0+**

The best way to install TaskPaper.sugar is directly from GitHub:

    cd ~/Library/Application\ Support/Espresso/Sugars
    git clone git://github.com/onecrayon/TaskPaper.sugar.git

Relaunch Espresso, and TaskPaper will be available in your **View&rarr;Languages** menu. You can then update the Sugar when necessary by running the following command:

    cd ~/Library/Application\ Support/Espresso/Sugars/TaskPaper.sugar
    git pull

Alternately, you can [download the Sugar](https://github.com/onecrayon/TaskPaper.sugar/zipball/master), decompress it, rename the resulting folder `TaskPaper.sugar`, and double click to install it.

## MIT License 

Copyright (c) 2012 Ian Beck

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
