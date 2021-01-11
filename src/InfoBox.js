import React from 'react';
import './InfoBox.css';
import {Card, CardContent, Typography} from "@material-ui/core";
import AnimationCount from 'react-count-animation'; 

function InfoBox({title, cases, total}) {
    return (
        <Card className={'infoBox'}>
            <CardContent>
                <Typography variant="h4" className={`infoBox__${title}`}>
                    {title}
                </Typography>

                <Typography variant="h6" className="infoBox__cases"  color="textSecondary">
                    Today
                </Typography>
                
                <Typography variant="subtitle2" color="textSecondary">
                    <AnimationCount 
                        start={0}
                        count={cases}
                        duration={2000}
                        useGroup={true}
                        animation="up"
                    >
                    </AnimationCount>
                </Typography>
                
                <Typography variant="h5" className="infoBox__cases"  color="textPrimary">
                    Total
                </Typography>

                <Typography variant="subtitle2" className="infoBox__total" color="textPrimary">
                    <AnimationCount 
                        start={0}
                        count={total}
                        duration={2000}
                        useGroup={true}
                        animation="up"
                    />
                </Typography>

            </CardContent>            
        </Card>
    )
}

export default InfoBox
