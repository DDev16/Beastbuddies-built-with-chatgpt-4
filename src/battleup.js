import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import battleContractAbi from './Pokebattle.json';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  formControl: {
    minWidth: 120,
  },
});

const BattleUp = ({ contractAddress, provider }) => {
  const classes = useStyles();
  const [contract, setContract] = useState();
  const [itemType, setItemType] = useState('None');

  useEffect(() => {
    if (provider) {
      const signer = provider.getSigner();
      const battleContract = new ethers.Contract(
        contractAddress,
        battleContractAbi.abi,
        signer,
      );
      setContract(battleContract);
    }
  }, [provider, contractAddress]);

  const handleItemTypeChange = (event) => {
    setItemType(event.target.value);
  };

  const buyItem = async () => {
    if (contract && itemType !== 'None') {
      try {
        const tx = await contract.buyItem(1, itemType);
        await tx.wait();
        console.log('Item bought successfully');
      } catch (error) {
        console.error('Error buying item:', error);
      }
    }
  };

  const useItem = async () => {
    if (contract && itemType !== 'None') {
      try {
        const tx = await contract.attack(1, itemType);
        await tx.wait();
        console.log('Item used successfully');
      } catch (error) {
        console.error('Error using item:', error);
      }
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card className={classes.root}>
          <CardContent>
            <Typography className={classes.title} color="textSecondary" gutterBottom>
              Buy and Use Items
            </Typography>
            <FormControl className={classes.formControl}>
              <InputLabel id="item-select-label">Item</InputLabel>
              <Select
                labelId="item-select-label"
                id="item-select"
                value={itemType}
                onChange={handleItemTypeChange}
              >
                <MenuItem value="None">None</MenuItem>
                <MenuItem value="Shield">Shield</MenuItem>
                <MenuItem value="Potion">Potion</MenuItem>
                <MenuItem value="PowerUp">Power Up</MenuItem>
              </Select>
            </FormControl>
          </CardContent>
          <CardActions>
            <Button size="small" color="primary" onClick={buyItem}>
              Buy Item
            </Button>
            <Button size="small" color="secondary" onClick={useItem}>
              Use Item
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );
};

export default BattleUp;
