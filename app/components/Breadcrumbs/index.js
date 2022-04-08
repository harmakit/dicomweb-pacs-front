import React from 'react';
import { matchPath, useLocation, Link } from 'react-router-dom';
import TreeModel from 'tree-model';
import { Typography, Breadcrumbs as MUIBreadcrumbs } from '@mui/material';
import { routes } from '../../utils/history';

const tree = new TreeModel();
const root = tree.parse({
  name: routes.home,
  children: [
    {
      name: routes.studyList,
      children: [
        {
          name: routes.study,
          children: [
            {
              name: routes.series,
              children: [
                {
                  name: routes.instance,
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
});

export default function Breadcrumbs(props) {
  const location = useLocation();
  if (!location) {
    return null;
  }

  const getMatch = node =>
    matchPath(location.pathname, {
      path: node.model.name,
      exact: false,
      strict: false,
    });

  const getBreadcrumbsHistory = node => {
    let breadcrumbsHistoryNode = node;
    const breadcrumbsHistory = [getMatch(breadcrumbsHistoryNode)];
    while (breadcrumbsHistoryNode.parent) {
      breadcrumbsHistoryNode = breadcrumbsHistoryNode.parent;
      breadcrumbsHistory.push(getMatch(breadcrumbsHistoryNode));
    }
    return breadcrumbsHistory.reverse();
  };

  const currentNode = root.first(
    node =>
      !!matchPath(location.pathname, {
        path: node.model.name,
        exact: true,
        strict: false,
      }),
  );

  const getBreadcrumbHistoryItemName = breadcrumbHistoryItem => {
    switch (breadcrumbHistoryItem.path) {
      case routes.studyList:
        return 'Studies';
      case routes.study:
        return `Study (${breadcrumbHistoryItem.params.studyId})`;
      case routes.series:
        return `Series (${breadcrumbHistoryItem.params.seriesId})`;
      case routes.instance:
        return `Instance (${breadcrumbHistoryItem.params.instanceId})`;
      default:
        return '';
    }
  };

  if (!currentNode) {
    return null;
  }
  const breadcrumbsHistory = getBreadcrumbsHistory(currentNode);

  return (
    <MUIBreadcrumbs aria-label="breadcrumb">
      {breadcrumbsHistory.map((breadcrumbHistoryItem, index) => {
        const last = index === breadcrumbsHistory.length - 1;
        return (
          <span key={breadcrumbHistoryItem.url}>
            {last ? (
              <Typography color="textPrimary">
                {getBreadcrumbHistoryItemName(breadcrumbHistoryItem)}
              </Typography>
            ) : (
              <Link to={breadcrumbHistoryItem.url}>
                {getBreadcrumbHistoryItemName(breadcrumbHistoryItem)}
              </Link>
            )}
          </span>
        );
      })}
    </MUIBreadcrumbs>
  );
}

Breadcrumbs.propTypes = {
  // location: PropTypes.object.isRequired,
};
