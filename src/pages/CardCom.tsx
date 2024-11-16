import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Grid, Typography } from "@mui/material";
import DataGrids from '../utils/Datagrids';
import moment from 'moment';
import api from '../utils/Url';
import { useTranslation } from "react-i18next";
import { GridColDef } from "@mui/x-data-grid";

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));


interface CardItem {
    title?: string;
    descr?: string;
    urlIfAny?: string;
    appliedAccnos?: string;
    appliedMembCodes?: string;
    dateSaved?: string;
    forAllUsers?: boolean;
    forMember?: string;
    libraryName?: string;
    districtName?: string;
  }
  
  interface CardComProps {
    data: CardItem[];
  
  }
  

export default function CardCom({ data }: CardComProps) {
    const { t } = useTranslation();
    const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null);
    const [digitalDatazones, setDigitalDataZones] = React.useState([]);
    const [digitalDatacolumns, setDigitalDataColumns] = React.useState<any>([]);

    const GetDigitalFile = async (id:any) => {
        try {
          
          const response = await api.get(`api/DigitalOperate/GetDigitalFiles`,{params:{digicontentid:id}});
          const data = response.data.data;
          const zonesWithIds = data.map((zone: any, index: any) => ({
            ...zone,
            serialNo: index + 1,
            id: zone.id,
          }));
          setDigitalDataZones(zonesWithIds);
    
          if (data.length > 0) {
            const columns: GridColDef[] = [
              {
                field: "serialNo",
                headerName: t("text.SrNo"),
                flex: 1,
              },
              {
                field: "givenFileName",
                headerName:" Related File Name",
                flex: 1,
              },
              {
                field: "comment",
                headerName: "Comment",
                flex: 1,
              },
              {
                field: "dateSaved",
                headerName: "Save Date ",
                flex: 1,
                renderCell: (params: { row: { dateSaved: moment.MomentInput; }; })=>{
                  return moment(params.row.dateSaved).format("DD-MM-YYYY")
              },
              }
            ];
            setDigitalDataColumns(columns as any);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

    const handleExpandClick = (index: number, id: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
        GetDigitalFile(id);
      };


    return (
        <>
        {data?.map((item:any, index:any) => (
      <Card  key={index}style={{
        width: "100%",
        border: ".5px solid #2B4593",
      }}>
            <>
        <CardContent>
            <Grid container spacing={3}>
              {item.title && (
                <Grid item xs={12} md={4} lg={4}>
                  <Typography fontSize={{ xs: 14, sm: 17 }} fontWeight={600}>
                    Title/Collection: 
                  </Typography>{item.title}
                </Grid>
              )}
              {item.descr && (
                <Grid item xs={12} md={4} lg={4}>
                  <Typography fontSize={{ xs: 14, sm: 17 }} fontWeight={600}>
                    Description:
                  </Typography> {item.descr}
                </Grid>
              )}
              {item.urlIfAny && (
                <Grid item xs={12} md={4} lg={4}>
                  <Typography fontSize={{ xs: 14, sm: 17 }} fontWeight={600}>
                    URL If Any
                  </Typography> {item.urlIfAny}
                </Grid>
              )}
              {item.appliedAccnos && (
                <Grid item xs={12} md={4} lg={4}>
                  <Typography fontSize={{ xs: 14, sm: 17 }} fontWeight={600}>
                    Applicable Accnos:
                  </Typography> {item.appliedAccnos}
                </Grid>
              )}
              {item.appliedMembCodes && (
                <Grid item xs={12} md={4} lg={4}>
                  <Typography fontSize={{ xs: 14, sm: 17 }} fontWeight={600}>
                    Applicable User/Member: 
                  </Typography>{item.appliedMembCodes}
                </Grid>
              )}
              {item.dateSaved && (
                <Grid item xs={12} md={4} lg={4}>
                  <Typography fontSize={{ xs: 14, sm: 17 }} fontWeight={600}>
                    Date Saved: 
                  </Typography>{new Date(item.dateSaved).toLocaleDateString()}
                </Grid>
              )}
              {item.forAllUsers !== undefined && (
                <Grid item xs={12} md={4} lg={4}>
                  <Typography fontSize={{ xs: 14, sm: 17 }} fontWeight={600}>
                    For All Users: 
                  </Typography>{item.forAllUsers ? 'Yes' : 'No'}
                </Grid>
              )}
              {item.forMember && (
                <Grid item xs={12} md={4} lg={4}>
                  <Typography fontSize={{ xs: 14, sm: 17 }} fontWeight={600}>
                    For Member:
                  </Typography> {item.forMember}
                </Grid>
              )}
              {item.libraryName && (
                <Grid item xs={12} md={4} lg={4}>
                  <Typography fontSize={{ xs: 14, sm: 17 }} fontWeight={600}>
                    Library Name: 
                  </Typography>{item.libraryName}
                </Grid>
              )}
              {item.districtName && (
                <Grid item xs={12} md={4} lg={4}>
                  <Typography fontSize={{ xs: 14, sm: 17 }} fontWeight={600}>
                    District Name: 
                  </Typography>{item.districtName}
                </Grid>
              )}
            </Grid>
         
        </CardContent>
        <CardActions disableSpacing>
          <ExpandMore
             expand={expandedIndex === index}
             onClick={() => handleExpandClick(index, item.id!)}
             aria-expanded={expandedIndex === index}
             aria-label="show more"
          >
            <ExpandMoreIcon /> Show Files
          </ExpandMore>
        </CardActions>
        <Collapse in={expandedIndex === index} timeout="auto" unmountOnExit>
          <CardContent>
            {digitalDatazones.length > 0 ? (
              <>
                <Typography paragraph>Related Files:</Typography>
                <DataGrids
                  isLoading={false}
                  rows={digitalDatazones}
                  columns={digitalDatacolumns}
                  pageSizeOptions={[5, 10, 25, 50, 100]}
                  initialPageSize={5}
                />
              </>
            ) : (
              <Typography>No Data available.</Typography>
            )}
          </CardContent>
        </Collapse> </>
      </Card>))}
      </>
    );
  };