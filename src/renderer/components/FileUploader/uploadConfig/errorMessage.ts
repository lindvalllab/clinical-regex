interface YupError {
  path: string;
  message: string;
}

const validationErrorMessage = (headers: string[]) => {
  // Convert the Yup validation error into a human-readable error message.
  return (error: YupError): string => {
    if (error.path === 'idCol')
      return (
        'The ID column "idCol" is invalid. Please specify one of [' +
        headers.join(', ') +
        '] (case sensitive).'
      );
    else if (error.path === 'textCol')
      return (
        'The text column "textCol" is invalid. Please specify one of [' +
        headers.join(', ') +
        '] (case sensitive).'
      );
    else if (error.path === 'labels')
      return 'The labels must consist of a JSON list.';
    else if (error.path.startsWith('labels') && error.path.endsWith('title'))
      return (
        'One of the label titles "' +
        error.path +
        '" is invalid. It must be a string.'
      );
    else if (error.path.startsWith('labels') && error.path.includes('keywords'))
      return (
        'One of the label keywords "' +
        error.path +
        '" is invalid. It must be a list of strings.'
      );
    else if (error.path.startsWith('labels'))
      return (
        'One of the labels "' +
        error.path +
        `" is invalid. It must be of the form
          {
            "title": "label name"
            "keywords": ["list", "of", "keywords"]
          }.`
      );
    return 'Unknown error (' + error.path + '): ' + error.message;
  };
};

export default validationErrorMessage;
