package aor.paj.bean;

import aor.paj.dto.DashboardOverviewDto;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

@ApplicationScoped
public class DashboardBean {

    @Inject
    private UserBean userBean;

    @Inject
    private ProductBean productBean;

    public DashboardOverviewDto getOverview() {
        DashboardOverviewDto overview = new DashboardOverviewDto();

    // 📊 Users
    overview.setTotalUsers(userBean.countTotalUsers());
    overview.setConfirmedUsers(userBean.countConfirmedUsers());

         // 📊 Products
    overview.setTotalProducts(productBean.getProductCount().intValue());
    overview.setDraftProducts(productBean.countDraftProducts());
    overview.setPublishedProducts(productBean.countPublishedProducts());
    overview.setReservedProducts(productBean.countReservedProducts());
    overview.setPurchasedProducts(productBean.countPurchasedProducts());
    overview.setInactiveProducts(productBean.countInactiveProducts());
    overview.setPopularCategories(productBean.getPopularCategories());
    overview.setProductsPerUser(productBean.getProductsPerUser());
        overview.setAverageTimeToPurchase(productBean.calculateAverageTimeToPurchase());
        overview.setUsersOverTime(userBean.getUsersOverTime());
overview.setProductsPurchasedOverTime(productBean.getProductsPurchasedOverTime());

        return overview;
    }
}
