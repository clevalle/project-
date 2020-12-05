import React, {useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import SharedContext from './SharedContext';
// import TitleBar from './TitleBar';
import Content from './Content';
import MailboxDrawer from './MailboxDrawer';
import TitleBar from './TitleBar';
import EmailPopup from './EmailPopup';

import DeleteIcon from '@material-ui/icons/Delete';
import MailIcon from '@material-ui/icons/Mail';
import StarIcon from '@material-ui/icons/Star';
import InputIcon from '@material-ui/icons/Input';
import DraftsIcon from '@material-ui/icons/Drafts';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
}));

/**
 * Simple component with no state.
 *
 * @return {object} JSX
 */
function App() {
  // const [dummy, setDummy] = React.useState('');
  const [mailbox, setMailbox] = React.useState('inbox');
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [emails, setEmails] = React.useState();
  const [showEmail, setShowEmail] = React.useState(false);
  const [currEmail, setCurrEmail] = React.useState('');
  const [inboxList, setInboxList] = React.useState([
    {type: 'built', name: 'inbox', icon: <MailIcon/>, current: true},
    {type: 'built', name: 'trash', icon: <DeleteIcon/>, current: false},
    {type: 'built', name: 'starred', icon: <StarIcon/>, current: false},
    {type: 'built', name: 'sent', icon: <InputIcon/>, current: false},
    {type: 'built', name: 'drafts', icon: <DraftsIcon/>, current: false},
  ]);
  // inboxList.map((inbox) => console.log(inbox));
  useEffect(() => {
    fetch(`http://localhost:3010/v0/mail?mailbox=${mailbox}`)
        .then((response) => {
          if (!response.ok) {
            throw response;
          }
          return response.json();
        })
        .then((json) => {
          console.log(json);
          setEmails(json);
        })
        .catch((error) => {
          setEmails(error.toString());
        });
  }, [mailbox, showEmail]);

  window.addEventListener('resize', () => {
    setDrawerOpen(false);
  });
  /*
  if (emails) {
    emails.map((email) => console.log(email.mailbox));
  }
  */
  const toggleDrawerOpen = () => {
    console.log('mailbox = '+mailbox);
    setDrawerOpen(!drawerOpen);
  };
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CssBaseline/>
      <SharedContext.Provider value= {{
        mailbox, setMailbox,
        drawerOpen, setDrawerOpen,
        emails, setEmails,
        showEmail, setShowEmail,
        currEmail, setCurrEmail,
        inboxList, setInboxList,
        toggleDrawerOpen,
      }}
      >
        <TitleBar/>
        <MailboxDrawer/>
        <Content/>
        {showEmail && emails && <EmailPopup/>}
      </SharedContext.Provider>
    </div>
  );
}

export default App;
