import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
// import Toolbar from '@material-ui/core/Toolbar';
// import Hidden from '@material-ui/core/Hidden';
import Paper from '@material-ui/core/Paper';
import {TableRow, TableCell, Avatar} from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import './Content.css';
import blue from '@material-ui/core/colors/blue';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';
import Typography from '@material-ui/core/Typography';

import SharedContext from './SharedContext';


const useStyles = makeStyles({
  tablecell: {
    fontWeight: 'bold',
  },
  blue: {
    backgroundColor: blue[500],
  },
});

/**
 * change date function
 * @return {arr} array
 * @param {arr} email array
 */
function editDate(email) {
  let newFormat = '';
  const today = formatDate(new Date());
  const yearAgoToday = (parseInt(today.substring(0, today.length-6))-1) +
    today.substring(4, today.length);
  const m = ['JAN', 'FEB', 'MAR', 'APR', 'MAY',
    'JUN', 'JUL', 'AUG', 'SEP', 'OCT',
    'NOV', 'DEC'];
  const emailDate = email.mail.received.substring(0, email.mail.received.length-10);
  const emailDay = email.mail.received.substring(8, email.mail.received.length-10);
  const emailMonth = email.mail.received.substring(5, email.mail.received.length-13);
  if (emailDate.match(today)) {
    console.log('match found');
    newFormat = email.mail.received.substring(11, email.mail.received.length-4);
  } else if (emailDate < today && emailDate > yearAgoToday) {
    const newDate = m[emailMonth-1]+' '+emailDay;
    newFormat = newDate;
  } else {
    newFormat = email.mail.received.substring(0, email.mail.received.length-16);
  }
  return newFormat;
}
/**
 * @return {string} array
 * @param {string} date array
 */
function formatDate(date) {
  // borrowed from https://stackoverflow.com/questions/23593052/format-javascript-date-as-yyyy-mm-dd
  const d = new Date(date);
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  const year = d.getFullYear();
  if (month.length < 2) {
    month = '0' + month;
  }
  if (day.length < 2) {
    day = '0' + day;
  }
  return [year, month, day].join('-');
}

/**
 * @param {object} emails emails
 * @return {object} JSX
 */
function detailEmails(emails) {
  const emailList = [];
  emails
      .sort((a, b) => (a.mail.received < b.mail.received) ? 1 : -1)
      .map((email) => {
        // email.mail.content = email.mail.content.substring(0, 40) + '...';
        emailList.push(email);
      });
  return emailList;
}

/**
 * @return {object} JSX
 */
function Content() {
  let emailList = [];
  const classes = useStyles();
  const [star, setStar] = React.useState('');
  const {mailbox, emails, setShowEmail, setCurrEmail} =
    React.useContext(SharedContext);
  if (emails && emails.length > 0) {
    emailList = detailEmails(emails);
  }
  return (
    <div className='containerBody'>
      <div className="mailbox">{mailbox}</div>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableBody>
            {emailList && emailList.map((email) => (
              <>
                <TableRow
                  className="email"
                  key={email.mail.id} id={email.mail.id}
                >
                  <TableCell>{email.avatar ? 'N/A' : <Avatar className={classes.blue}>{email.mail.from.name.split(" ").map((n)=>n[0]).join("")}</Avatar>}</TableCell>
                  <TableCell 
                    className={`emailBody ${email.mail.unread == 'true' ? classes.tablecell : ""}`} 
                    size="small"
                    onClick={() => {
                      setShowEmail(true);
                      setCurrEmail(email);
                    }}
                  >
                    {email.mail.from.name}
                    <br/> {email.mail.subject}
                    <br/> {email.mail.content}</TableCell>
                  <TableCell align="right">{editDate(email)}
                  {console.log('TEST='+email.mail.starred)}
                <br/> {email.mail.starred == true ? 
                  <StarIcon onClick={() => {
                    setStar('on');
                    fetch(`http://localhost:3010/v0/mail/${email.id}?starred=false`, {
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
                  }}/> :
                  <StarBorderIcon onClick={() => {
                    setStar('off');
                    fetch(`http://localhost:3010/v0/mail/${email.id}?starred=true`, {
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
                  }}/>}
                  </TableCell>
                </TableRow>
              </>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Content;
