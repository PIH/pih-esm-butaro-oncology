import React from "react";
import { InlineLoading, Tile } from "carbon-components-react";
import { ValueTile } from "../value-tile";
import { useNextVisit } from "../patient-status-widget.resource";
import { formatDate } from "@openmrs/esm-framework";

interface nextVisitTileProps {
  patientUuid: string;
  codeUuids: string;
}

export function NextVisitTile({ patientUuid, codeUuids }: nextVisitTileProps) {
  const { nextVisitDate, conceptName, isError, isLoading, isValidating } =
    useNextVisit(patientUuid, codeUuids);

  return (
    <Tile light>
      <ValueTile label={conceptName ?? "Next visit Date"}>
        {isLoading ? <InlineLoading /> : null}
        {isValidating ? <InlineLoading /> : null}
        {isError ? "Error" : null}
        {!isLoading && nextVisitDate ? formatDate(nextVisitDate) ?? "—" : null}
      </ValueTile>
    </Tile>
  );
}