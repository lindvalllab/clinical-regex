interface YupError {
  path: string;
  message: string;
}

const validationErrorMessage = (headers: string[]) => {
  // Convert the Yup validation error into a human-readable error message.
  return (error: YupError): string => {
    if (error.path === 'idField')
      return (
        'The ID column "idField" is invalid. Please specify one of [' +
        headers.join(', ') +
        '] (case sensitive).'
      );
    else if (error.path === 'textField')
      return (
        'The text column "textField" is invalid. Please specify one of [' +
        headers.join(', ') +
        '] (case sensitive).'
      );
    else if (error.path === 'labels')
      return 'The labels must consist of a JSON list.';
    else if (error.path.startsWith('labels') && error.path.endsWith('name'))
      return (
        'One of the label names "' +
        error.path +
        '" is invalid. It must be a string.'
      );
    else if (error.path.startsWith('labels') && error.path.includes('patterns'))
      return (
        'One of the label patterns "' +
        error.path +
        '" is invalid. It must be a list of strings.'
      );
    else if (error.path.startsWith('labels'))
      return (
        'One of the labels "' +
        error.path +
        `" is invalid. It must be of the form
          {
            "name": "label name"
            "patterns": ["list", "of", "patterns"]
          }.`
      );
    return 'Unknown error (' + error.path + '): ' + error.message;
  };
};

export default validationErrorMessage;
