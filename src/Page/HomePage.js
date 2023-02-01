import * as React from "react";
import Button from "@mui/material/Button";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
} from "@mui/material";

export function HomePage() {
  return (
    <Grid container spacing={2} sx={{ marginTop: "1em" }}>
      <Grid xs={12} sm={6} md={4} lg={3} xl={2} item>
        <Card sx={{ maxWidth: 345 }}>
          <CardMedia
            component="img"
            alt="exam paper"
            height="140"
            image="http://en.tums.ac.ir/images/www/en/news/news-primary/2019/1573368194-exam2.jpg"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              CIB Mock Test
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This is a test used for preparing CIB final exam. There are 70%
              multiple-choice and 30% constructive questions.
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">Edit</Button>
            <Button size="small">Practice</Button>
          </CardActions>
        </Card>
      </Grid>

      <Grid xs={12} sm={6} md={4} lg={3} xl={2} item>
        <Card sx={{ maxWidth: 345 }}>
          <CardMedia
            component="img"
            alt="exam paper"
            height="140"
            image="https://gln.edu.vn/wp-content/uploads/2019/06/ielts-la-gi-va-nhung-dieu-can-biet-cho-nguoi-moi-bat-dau-01.png"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              IELTS Practice Test 1
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This is a practice test including 2 parts - Listening and Reading.
              Duration time: 120 min
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">Edit</Button>
            <Button size="small">Practice</Button>
          </CardActions>
        </Card>
      </Grid>

      <Grid xs={12} sm={6} md={4} lg={3} xl={2} item>
        <Card sx={{ maxWidth: 345 }}>
          <CardMedia
            component="img"
            alt="exam paper"
            height="140"
            image="https://scholarshipplanet.info/vi/wp-content/uploads/2015/10/IMG_4238-1024x682.jpg"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              GRE Practice Test 2
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This is a practice test including 2 parts: Verbal reasoning and
              Quantiative. The duration time: 90 min
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">Edit</Button>
            <Button size="small">Practice</Button>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );
}
