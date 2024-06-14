import React from 'react';
import 'rsuite/dist/rsuite.min.css';
import { toaster, Notification } from 'rsuite';

 //show an alert of error with message
const showErrorMessage = (message = "error")=>{
    toaster.push(
        <Notification type="error" header="Error" closable>
          {message}
        </Notification>, 
        { placement: 'topEnd' }
      );
}

export default showErrorMessage;
