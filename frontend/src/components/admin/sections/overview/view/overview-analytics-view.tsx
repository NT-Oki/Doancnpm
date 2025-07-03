import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import axios from "axios";
import { Box, Button, MenuItem, TextField } from "@mui/material";

import { DashboardContent } from "../../../layouts/dashboard";
import API_URLS from "../../../../../config/api";
import { AnalyticsWebsiteVisits } from "../analytics-website-visits";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import MovieIcon from "@mui/icons-material/Movie";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

import { Card } from "@mui/material";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// ----------------------------------------------------------------------

interface SeatsWeeklyData {
  date: string;
  seats: number;
}

interface RevenueData {
  date: string;
  revenue: number;
}

interface TopMovieWatched {
  movieName: string;
  viewCount: number;
}

function exportTopMoviesToExcel(movies: TopMovieWatched[]) {
  const data = movies.map((movie, index) => ({
    STT: index + 1,
    "Tên phim": movie.movieName,
    "Số vé bán": movie.viewCount,
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Top 5 Phim");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, "Top_5_Phim_Duoc_Xem_Nhieu_Nhat.xlsx");
}

export function OverviewAnalyticsView() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [seatsWeekly, setSeatsWeekly] = useState<SeatsWeeklyData[]>([]);
  const [revenueStats, setRevenueStats] = useState<RevenueData[]>([]);
  const [type, setType] = useState<"daily" | "monthly" | "yearly">("monthly");
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [totalTickets, setTotalTickets] = useState<number>(0);
  const [nowShowingCount, setNowShowingCount] = useState<number>(0);
  const [topMovies, setTopMovies] = useState<TopMovieWatched[]>([]);

  const handleExportRevenueStats = () => {
    if (!revenueStats.length) {
      toast.warn("Không có dữ liệu để xuất");
      return;
    }

    // Chuẩn bị dữ liệu xuất
    const worksheetData = revenueStats.map((item) => ({
      "Ngày/Tháng/Năm": item.date,
      "Doanh thu (₫)": item.revenue.toLocaleString(),
    }));

    // Tạo worksheet và workbook
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Thống kê doanh thu");

    // Tạo tên file gợi nhớ type
    let fileName = "thong_ke_doanh_thu.xlsx";
    if (type === "daily")
      fileName = `doanh_thu_theo_ngay_${month}_${year}.xlsx`;
    else if (type === "monthly") fileName = `doanh_thu_theo_thang_${year}.xlsx`;
    else if (type === "yearly") fileName = `doanh_thu_theo_nam.xlsx`;

    // Xuất file
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, fileName);
  };

  useEffect(() => {
    const fetchSeatsWeekly = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error(t("auth.login.required"));
          navigate("/login");
          return;
        }
        // Ghế bán
        const response = await axios.get(API_URLS.ADMIN.booking.SEATS_WEEKLY, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Accept-Language": i18n.language,
          },
        });
        console.log("API response:", response.data); // Debug
        const data = response.data.data || [];
        if (!data.length) {
          toast.warn(t("dashboard.noData"));
        }
        setSeatsWeekly(data);

        // Doanh thu
        const params: any = { type }; // 'daily' | 'monthly' | 'yearly'
        if (type === "daily" || type === "monthly") params.year = year;
        if (type === "daily") params.month = month;
        const revenueResponse = await axios.get(
          API_URLS.ADMIN.booking.REVENUE_STATS,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Accept-Language": i18n.language,
            },
            params,
          }
        );
        const revenueData = revenueResponse.data || [];
        if (!revenueData.length) {
          toast.warn(t("dashboard.noData"));
        }
        setRevenueStats(revenueData);
      } catch (error: any) {
        console.error("Lỗi khi lấy thống kê ghế:", error);
        toast.error(t("booking.stats.failed"));
      }
    };
    fetchSeatsWeekly();

    // Tổng doanh thu
    const fetchTotalRevenue = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error(t("auth.login.required"));
          navigate("/login");
          return;
        }
        const response = await axios.get(API_URLS.ADMIN.booking.REVENUE_TOTAL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTotalRevenue(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy tổng doanh thu:", error);
        toast.error("Lỗi khi lấy tổng doanh thu");
      }
    };
    fetchTotalRevenue();

    // Tổng vé bán
    const fetchTotalTickets = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error(t("auth.login.required"));
          navigate("/login");
          return;
        }
        const response = await axios.get(API_URLS.ADMIN.booking.TICKETS_TOTAL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTotalTickets(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy tổng vé đã bán:", error);
        toast.error("Lỗi khi lấy tổng vé đã bán");
      }
    };
    fetchTotalTickets();

    // Tổng phim đang chiếu
    const fetchNowShowingCount = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error(t("auth.login.required"));
          navigate("/login");
          return;
        }
        const response = await axios.get(
          API_URLS.ADMIN.movie.NOW_SHOWING_COUNT,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setNowShowingCount(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy số phim đang chiếu:", error);
        toast.error("Lỗi khi lấy số phim đang chiếu");
      }
    };
    fetchNowShowingCount();

    // Top Phim doanh thu
    const fetchTopMovies = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error(t("auth.login.required"));
          navigate("/login");
          return;
        }

        const response = await axios.get(API_URLS.ADMIN.booking.TOP_MOVIES, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Accept-Language": i18n.language,
          },
        });

        const data = response.data || [];
        console.log(data);
        if (!data.length) {
          toast.warn(t("dashboard.noData"));
        }
        setTopMovies(data);
      } catch (error: any) {
        console.error("Lỗi khi lấy top phim được xem nhiều nhất:", error);
        toast.error(t("dashboard.fetchFailed"));
      }
    };
    fetchTopMovies();
  }, [t, i18n.language, navigate, type, year, month]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <DashboardContent maxWidth="xl">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: { xs: 3, md: 5 },
        }}
      >
        <Typography variant="h4">{t("dashboard.welcome")} </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            onClick={() => changeLanguage("vi")}
            sx={{
              color: "primary.main",
              fontWeight: i18n.language === "vi" ? "bold" : "normal",
            }}
          >
            VI
          </Button>
          <Button
            onClick={() => changeLanguage("en")}
            sx={{
              color: "primary.main",
              fontWeight: i18n.language === "en" ? "bold" : "normal",
            }}
          >
            EN
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid container spacing={3} mb={2}>
          <Grid item size={{ xs: 12, md: 12, lg: 4 }}>
            <Card
              sx={{
                p: 4,

                boxShadow: 2,
                borderRadius: 2,
                display: "flex",
                justifyContent: "space-between",
                minWidth: { xs: "100%", md: 260 },
              }}
            >
              <Box>
                <Typography
                  variant="h5"
                  color="text.secondary"
                  fontWeight="medium"
                >
                  {t("dashboard.revenue")}
                </Typography>
                <Typography variant="h5" fontWeight="bold" color="primary.main">
                  {totalRevenue ? `${totalRevenue.toLocaleString()} ₫` : "0 ₫"}
                </Typography>
              </Box>
              <AttachMoneyIcon fontSize="large" color="success" />
            </Card>
          </Grid>

          <Grid item size={{ xs: 12, md: 8, lg: 4 }}>
            <Card
              sx={{
                p: 4,

                boxShadow: 2,
                borderRadius: 2,
                display: "flex",
                justifyContent: "space-between",
                minWidth: { xs: "100%", md: 260 },
              }}
            >
              <Box>
                <Typography
                  variant="h5"
                  color="text.secondary"
                  fontWeight="medium"
                >
                  {t("dashboard.ticketsSold")}
                </Typography>
                <Typography variant="h5" fontWeight="bold" color="primary.main">
                  {totalTickets ? totalTickets.toLocaleString() : "0"}
                </Typography>
              </Box>
              <ConfirmationNumberIcon fontSize="large" color="info" />
            </Card>
          </Grid>

          <Grid item size={{ xs: 12, md: 12, lg: 4 }}>
            <Card
              sx={{
                p: 4,

                boxShadow: 2,
                borderRadius: 2,
                display: "flex",
                justifyContent: "space-between",
                minWidth: { xs: "100%", md: 260 },
              }}
            >
              <Box mr={2}>
                <Typography
                  variant="h5"
                  color="text.secondary"
                  fontWeight="medium"
                >
                  {t("dashboard.movieShowing")}
                </Typography>
                <Typography variant="h5" fontWeight="bold" color="primary.main">
                  {nowShowingCount ? nowShowingCount.toLocaleString() : "0"}
                </Typography>
              </Box>
              <MovieIcon fontSize="large" color="secondary" />
            </Card>
          </Grid>
        </Grid>

        <Grid size={{ xs: 12, md: 12, lg: 12 }}>
          {seatsWeekly.length ? (
            <AnalyticsWebsiteVisits
              title={t("dashboard.seatsSoldWeekly")}
              subheader={t("dashboard.seatsSoldSubheader")}
              chart={{
                categories: seatsWeekly.map((item) => item.date),
                series: [
                  {
                    name: t("seat.normal"),
                    data: seatsWeekly.map((item) => item.seats),
                  },
                ],
              }}
            />
          ) : (
            <Typography variant="body1" color="text.secondary">
              {t("dashboard.noData")}
            </Typography>
          )}
        </Grid>

        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              width: "100%",
              flexWrap: "wrap",
            }}
          >
            <TextField
              select
              label={t("dashboard.typeSta")}
              value={type}
              onChange={(e) =>
                setType(e.target.value as "daily" | "monthly" | "yearly")
              }
              size="small"
              sx={{ width: 180 }}
            >
              <MenuItem value="daily">{t("dashboard.ByDay")}</MenuItem>
              <MenuItem value="monthly">{t("dashboard.ByMonth")}</MenuItem>
              <MenuItem value="yearly">{t("dashboard.ByYear")}</MenuItem>
            </TextField>

            {(type === "daily" || type === "monthly") && (
              <TextField
                label={t("dashboard.Year")}
                type="number"
                value={year}
                onChange={(e) =>
                  setYear(parseInt(e.target.value) || new Date().getFullYear())
                }
                size="small"
                sx={{ width: 120 }}
              />
            )}

            {type === "daily" && (
              <TextField
                label={t("dashboard.Month")}
                type="number"
                value={month}
                onChange={(e) =>
                  setMonth(
                    parseInt(e.target.value) || new Date().getMonth() + 1
                  )
                }
                size="small"
                sx={{ width: 120 }}
              />
            )}
          </Box>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
            <Button
              variant="contained"
              color="success"
              //   startIcon={<DownloadIcon />}
              onClick={handleExportRevenueStats}
            >
              {t("dashboard.excelExport")}
            </Button>
          </Box>
          <AnalyticsWebsiteVisits
            title={t("dashboard.revenueStatistics")}
            subheader={t("dashboard.revenueDescription")}
            chart={{
              categories:
                revenueStats.length > 0
                  ? revenueStats.map((item) => item.date)
                  : [""],

              series: [
                {
                  name: t("dashboard.revenue"),
                  data:
                    revenueStats.length > 0
                      ? revenueStats.map((item) => item.revenue)
                      : [0],
                },
              ],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          {topMovies.length ? (
            <>
              <Box display="flex" justifyContent="flex-end" mb={1}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => exportTopMoviesToExcel(topMovies)}
                >
                  {t("dashboard.excelExport")}
                </Button>
              </Box>
              <AnalyticsWebsiteVisits
                title={t("dashboard.movieTopShow")}
                subheader={t("dashboard.movieTopShowDes")}
                chart={{
                  categories: topMovies.map((item) => item.movieName),
                  series: [
                    {
                      name: "Vé bán",
                      data: topMovies.map((item) => item.viewCount),
                    },
                  ],
                  options: {
                    plotOptions: {
                      bar: {
                        horizontal: true,
                      },
                    },
                    xaxis: {
                      categories: topMovies.map((item) => item.movieName),
                      labels: {
                        style: { fontSize: "12px" },
                      },
                    },
                  },
                }}
              />
            </>
          ) : (
            <Typography variant="body1" color="text.secondary">
              {t("dashboard.noData")}
            </Typography>
          )}
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
