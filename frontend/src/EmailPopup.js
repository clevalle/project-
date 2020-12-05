import React, {useContext} from 'react';
import SharedContext from './SharedContext';
import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import './EmailPopup.css';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import MailIcon from '@material-ui/icons/Mail';
import MoveToInboxIcon from '@material-ui/icons/MoveToInbox';
import DeleteIcon from '@material-ui/icons/Delete';
import Avatar from '@material-ui/core/Avatar';
import MenuListComposition from './DropdownMenu';

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  Box: {
    zIndex: theme.zIndex.appBar + 100000,
    height: '100%',
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '100%',
      height: 400,
    },
  },
}));

/**
 * @param {obj} email email
 * @return {obj} email
 * date change
 */
function dateChange(email) {
  const m = ['January', 'February', 'March', 'April', 'May',
    'June', 'July', 'August', 'September', 'October',
    'November', 'December'];
  const emailDay = email.mail.received.substring(8, email.mail.received.length-10);
  const emailMonth = email.mail.received.substring(5, email.mail.received.length-13);
  const emailYear = email.mail.received.substring(0, email.mail.received.length-16);
  const newDate = m[emailMonth-1]+' '+emailDay;
  const newFormat = email.mail.received.substring(11, email.mail.received.length-4);
  const finalDate = (newDate + ' ' + emailYear + ' @ ' + newFormat);
  return (finalDate);
}

/**
 * @return {array} array
 * email popup
 */
function EmailPopup() {
  const classes = useStyles();
  const {mailbox, emails, setShowEmail, currEmail, inboxList, setInboxList} =
    React.useContext(SharedContext);
  const email = currEmail;
  console.log(email.id);
  console.log('currEMail = '+currEmail);
  return (
    // app bar from https://material-ui.com/components/app-bar/
    <SharedContext.Provider value={{mailbox, emails, inboxList, setInboxList}} >
      <Box
        className={classes.Box}
        component="div"
        position="fixed"
        bottom ='0%'
        bgcolor = 'white'
      >
        <div className="emailContent">
          <div className="header">
              <ArrowBackIosIcon fontSize="large" onClick={() => {
                  setShowEmail(false);
              }}/>
              <div className="rightIcons">
                <MailIcon fontSize="large" onClick={() => {
                    fetch(`http://localhost:3010/v0/mail/${email.id}?unread=false`, {
                        method: 'PUT'
                    })
                    .then((response) => {
                      if (!response.ok) {
                        throw response;
                      }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
                    setShowEmail(false);
                }}/>
                <MenuListComposition/>
                <DeleteIcon fontSize="large" onClick={() => {
                  fetch(`http://localhost:3010/v0/mail/${email.id}?mailbox=trash`, {
                      method: 'PUT'
                  })
                  .then((response) => {
                    if (!response.ok) {
                      throw response;
                    }
                  })
                  .catch((error) => {
                      console.log(error);
                  });
                  setShowEmail(false);
                }}/>
              </div>
          </div>  
          <p className="content">
            <b>{email.mail.subject}</b> <br/>
            {email.mailbox} <br/> 
            {email.avatar ? 'N/A' : <Avatar className={classes.blue}>{email.mail.from.name.split(" ").map((n)=>n[0]).join("")}</Avatar>} 
            {email.mail.from.name} {dateChange(email)}<br/>
            {email.mail.from.email} <br/>
            <br/>
            {email.mail.content}
          </p>
        </div>
      </Box>
    </SharedContext.Provider>
  );
}

export default EmailPopup;