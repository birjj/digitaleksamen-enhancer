# Mass upload file format

The extension supports mass uploading questions based on a pre-written configuration file.  
This allows you to e.g. write your exam in LaTeX, export it to images, and then have the extension upload those images to Digital Eksamen.

The extension expects you to select a directory containing a `manifest.json` file, which will be the configuration file you use to define the questions you want to upload, and the answers to each question.  
The exact structure of the file is specified in [a below section](#the-manifestjson-file-structure), but a general example could be:

```json
{
  "questions": [
    {
      "type": "basic",
      "content": "{{Q001.png}}",
      "answers": [
        {
          "content": "{{Q001_A001.png}}",
          "correct": true
        },
        {
          "content": "{{Q001_A002.png}}",
          "correct": false
        },
        {
          "content": "Ingen af ovenstående",
          "correct": false
        }
      ]
    },
    {
      "type": "matrix",
      "content": "Pick a card, any card",
      "titles": ["Sandt", "Falskt", "Ubeviseligt"],
      "answers": [
        [
          {
            "content": "Opt. 1",
            "correct": false
          },
          {
            "content": "Opt. 2",
            "correct": true
          },
          {
            "content": "Opt. 3",
            "correct": false
          }
        ]
      ]
    }
  ]
}
```

## The `manifest.json` file structure

The `manifest.json` file is used to describe your questions, each consisting of a content field and one (or more) answers. Each answer consists of a content field. More accurately, the format can be described using the types:

<table>
<thead>
<tr>
<th>Name</th>
<th>Definition (expressed in TypeScript)</th>
<th>Example</th>
</tr>
</thead>
<tbody>
<tr><td>

### `Content`

Describes the contents of a text field.
You can use the format `{{ filename }}` to embed an image, where the filename is relative to `manifest.json`.  
You can also use HTML to format your text.

</td>
<td>

```typescript
type Content = string;
```

</td><td>

```json
"Pick the solution to the following equation: {{Q001.png}}"
```

</td></tr>
<tr><td>

### `Answer`

Represents an answer option, e.g. an answer to a [`BasicQuestion`](#basicquestion) or an answer to a row in a [`MatrixQuestion`](#matrixquestion).

</td><td>

```typescript
type Answer = {
  content: Content;
  correct: boolean;
};
```

</td><td>

```json
{
  "content": "{{Q001-A001.png}}",
  "correct": true
}
```

</td></tr>
<tr><td>

### `BasicQuestion`

Consists of the question content and multiple answers. Exactly one of the answers must be marked as `correct`.

</td><td>

```typescript
type BasicQuestion = {
  type: "basic";
  content: Content;
  answers: Answer[];
};
```

</td><td>

```json
{
  "type": "basic",
  "content": "Pick the solution to the following equation: {{Q001.png}}",
  "answers": [
    { "content": "{{Q001-A001.png}}", "correct": true },
    { "content": "{{Q001-A002.png}}", "correct": false },
    { "content": "{{Q001-A003.png}}", "correct": false }
  ]
}
```

</td></tr>
<tr><td>

### `MatrixQuestion`

Consists of the question content, titles for a number of columns, and multiple rows. Each row consists of multiple answers.  
Exactly one of the answers in each row must be marked as `correct`.

</td><td>

```typescript
type MatrixQuestion = {
  type: "matrix";
  content: Content;
  titles: Content[];
  answers: Answer[][];
};
```

</td><td>

```json
{
  "type": "matrix",
  "content": "Pick the lowest value in each row",
  "titles": ["Mulighed #1", "Mulighed #2"],
  "answers": [
    [
      { "content": "{{Q002-001-1.png}}", "correct": false },
      { "content": "{{Q002-001-2.png}}", "correct": true },
      { "content": "{{Q002-001-3.png}}", "correct": false }
    ],
    [
      { "content": "{{Q002-002-1.png}}", "correct": true },
      { "content": "{{Q002-002-2.png}}", "correct": false },
      { "content": "{{Q002-002-3.png}}", "correct": false }
    ]
  ]
}
```

</td></tr>
<tr><td>

### `Manifest`

Describes the entire exam, as should be uploaded by the extension.

</td><td>

```typescript
type Manifest = {
  questions: (BasicQuestion | MatrixQuestion)[];
};
```

</td><td>

```json
{
  "questions": [
    {
      "type": "basic"
      // ..., rest of the first question
    },
    {
      "type": "matrix"
      // ..., rest of the second question
    }
  ]
}
```

</td></tr>
</tbody>
</table>
