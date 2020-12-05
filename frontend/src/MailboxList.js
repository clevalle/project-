import React, {useEffect} from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DeleteIcon from '@material-ui/icons/Delete';
import MailIcon from '@material-ui/icons/Mail';
import StarIcon from '@material-ui/icons/Star';
import InputIcon from '@material-ui/icons/Input';
import DraftsIcon from '@material-ui/icons/Drafts';
import Divider from '@material-ui/core/Divider';
import AddIcon from '@material-ui/icons/Add';
import SettingsIcon from '@material-ui/icons/Settings';
import SharedContext from './SharedContext';

const boxes = [
  {type: 'built', name: 'inbox', icon: <MailIcon/>, current: true},
  {type: 'built', name: 'trash', icon: <DeleteIcon/>, current: false},
  {type: 'built', name: 'starred', icon: <StarIcon/>, current: false},
  {type: 'built', name: 'sent', icon: <InputIcon/>, current: false},
  {type: 'built', name: 'drafts', icon: <DraftsIcon/>, current: false},
];

/**
 * @return {object} JSX
 */
function MailboxList() {
  const {mailbox, selectMailbox, inboxList, setInboxList} = React.useContext(SharedContext);
  useEffect(() => {
    let list = inboxList;
    list?.map((e) => {
      if (e.current == true) {
        console.log('previously opened mailbox  = '+e.name);
        e.current = false;
      }
      if (e.name == mailbox) {
        console.log('new mailbox = '+e.name);
        e.current = true;
      }
      setInboxList(list);
    });
    console.log('mailbox updated');
  }, [mailbox])
  inboxList.map((inbox) => {
    console.log(inbox.name+' = '+inbox.current);
  })
  return (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {inboxList?.filter((allBox) => allBox.current == true).map((box) => (
          <ListItem button
            key={box.name}
            onClick={() => {
              // updateMailbox(box.name);
              selectMailbox(box.name);
            }}
          >
            <ListItemIcon>
              {box.icon}
            </ListItemIcon>
            <ListItemText primary={box.name}/>
          </ListItem>
        ))}
        <Divider />
        {inboxList?.filter((allBox) => allBox.current == false).map((box) => (
          <ListItem button
            key={box.name}
            onClick={() => {
              // updateMailbox(box.name);
              selectMailbox(box.name);
            }}
          >
            <ListItemIcon>
              {box.icon}
            </ListItemIcon>
            <ListItemText primary={box.name}/>
          </ListItem>
        ))}
        <Divider />
        <ListItem button
          key='newMailbox'
          onClick={() => {
            // on click functionalitty goes here
          }}
        >
          <ListItemIcon>
            <AddIcon/>
          </ListItemIcon>
          <ListItemText primary='New Mailbox'/>
        </ListItem>
        <Divider />
        <ListItem button
          key='Settings'
          onClick={() => {
            // on click functionalitty goes here
          }}
        >
          <ListItemIcon>
            <SettingsIcon/>
          </ListItemIcon>
          <ListItemText primary='Settings'/>
        </ListItem>
      </List>
    </div>
  );
}

export default MailboxList;
