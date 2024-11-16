import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import { Card, Grid, Typography, Divider, Box, Button, CircularProgress } from "@mui/material";
import { ConfirmDialog } from "primereact/confirmdialog";
import api from "../utils/Url";
import { useTranslation } from "react-i18next";
import ToastApp from "../ToastApp";
import { toast } from "react-toastify";
import { getMenuData } from "../utils/Constant";

// const style = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: "80%",
//   height: "85vh",
//   bgcolor: "#f5f5f5",
//   border: "1px solid #000",
//   boxShadow: 24,
//   p: 4,
//   borderRadius: 10,
// };

type Props = {};

export default function HelpDesk(props: Props) {
  const { i18n, t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [PageName, setPageName] = useState<string>("");
  const [PageDesk, setPageDesk] = useState<string>("");

  useEffect(() => {
    const { menuId } = getMenuData();
    
    if (menuId) {
      getHelpDesk(menuId);
    } else {
      toast.error("No Menu Id is  present. Please try again.");
    }
  }, []);

  const getHelpDesk = async (id: any) => {
    setIsLoading(true);
    try {
      const res = await api.post(`api/HelpCreate/GetHelpCreate`, { pageTitleId: id });
      if (res.data.data.length) {
        setPageName(res.data.data[0]["page_Name"]);
        setPageDesk(res.data.data[0]["frontDesign"]);
      } else {
        toast.warn("No content found.");
      }
    } catch (error) {
      toast.error("Failed to fetch data.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Grid item lg={6} sm={6} xs={12} sx={{ marginTop: "3vh" }}>
        <ToastApp />
        <Card
          sx={{
            backgroundColor: "#E9FDEE",
            border: ".5px solid #2B4593",
            marginTop: "5px",
            padding: "20px",
            borderRadius: 2,
          }}
        >
          <Paper sx={{ padding: "20px", borderRadius: 2 }}>
            <ConfirmDialog />
            <Typography variant="h4" component="div" sx={{ fontWeight: "bold", textAlign: "center" }}>
              {t("text.HelpDesk")}
            </Typography>
            <Divider sx={{ margin: "20px 0" }} />
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                <CircularProgress />
              </Box>
            ) : PageName && PageDesk ? (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography fontWeight="600" fontSize={20}>
                    Page Name: <i>{PageName}</i>
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6">
                    Content: 
                    <span dangerouslySetInnerHTML={{ __html: PageDesk }} />
                  </Typography>
                </Grid>
              </Grid>
            ) : (
              <Typography fontWeight="530" fontSize={30} textAlign="center">
                No content available.
              </Typography>
            )}
            {/* <Box sx={{ marginTop: "20px", textAlign: "center" }}>
              <Button variant="contained" color="primary" onClick={() => {}}>
                Contact Support
              </Button>
            </Box> */}
          </Paper>
        </Card>
      </Grid>
      <ToastApp />
    </>
  );
}
