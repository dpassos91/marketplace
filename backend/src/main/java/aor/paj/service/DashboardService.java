package aor.paj.service;

import aor.paj.bean.DashboardBean;
import aor.paj.dto.DashboardOverviewDto;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

@Path("/dashboard")
public class DashboardService {

    private static final Logger logger = LogManager.getLogger(DashboardService.class);

    @Inject
    DashboardBean dashboardBean;

    @GET
    @Path("/overview")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getDashboardOverview() {
        logger.info("Fetching dashboard overview.");

        DashboardOverviewDto overview = dashboardBean.getOverview();

        return Response.ok(overview).build();
    }
}

