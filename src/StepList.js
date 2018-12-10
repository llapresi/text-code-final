import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';

const StepList = ({steps, removeStep, setStepKey, hasParamsMap}) => (
    <React.Fragment>
        {steps.map((step, index) => {
            return (
                <Paper key={index} elevation={1} style={{ padding: '1.2em', margin: '.2em 0 .2em 0', position: 'relative' }}>
                    <Typography variant="h5" component="h3">
                        {`${index + 1}. ${step[0]}`}
                    </Typography>

                    {/* Only render the input field if hasParamsMap 
                    returns true for the encode/decode name*/}
                    {hasParamsMap[step[0]] === true &&
                        <TextField
                            label="Encryption Key"
                            defaultValue={step[1]}
                            value={step[1]}
                            onChange={setStepKey(index)}
                        />
                    }

                    <IconButton
                        style={{ position: 'absolute', top: '.5rem', right: '0' }}
                        onClick={() => removeStep(index)}
                    >
                        <Icon>delete</Icon>
                    </IconButton>
                </Paper>
            )
        })}
    </React.Fragment>
);

export default StepList;