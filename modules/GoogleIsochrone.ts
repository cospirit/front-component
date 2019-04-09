import {TravelMode, DistanceMatrixResponse, DistanceMatrixResponseRow, DistanceMatrixStatus} from "googlemaps";
import {LatLng} from "leaflet";

interface PointToDestination {
    point: LatLng;
    radian: number;
}

interface IsoCurveOption {
    graph?: string;
    method?: string;
    center?: LatLng;
    time?: number;
    distance?: number;
    radius?: number;
    onSuccess?: () => void;
    onError?: () => void;
}

export default class GoogleIsochrone {

    public static isoCurve(options: IsoCurveOption): void {

        // Normalize options
        const graph: TravelMode = options.graph && "DRIVING" === options.graph ?
            TravelMode.DRIVING : TravelMode.WALKING;
        const method: string = options.method ? options.method : "time";
        const center: LatLng = options.center ? options.center : new LatLng(0, 0);
        const time: number = options.time ? options.time : 1;
        const distance: number = options.distance ? options.distance : 1;
        const radius: number = options.radius ? options.radius : (  "time" === method ? time : distance);
        const onSuccess = options.onSuccess ? options.onSuccess : (results: string) => { return; };
        const onError = options.onError ? options.onError : (error: string) => { return; };

        // Create default point:
        const radiusLatLng: LatLng = GoogleIsochrone.getRadiusLatLng(center, radius * 0.66);
        const searchPoints: PointToDestination[]  = [];

        // Only 100 points : Limited Query by Google API
        for (let a = 0; a < 100; a ++) {
            const radian = (360 / 100) * a * (Math.PI / 180);
            searchPoints.push(GoogleIsochrone.getPointFromRadiusLatLng(center, radian, radiusLatLng));
        }

        GoogleIsochrone.processIsoCurve(
            0,
            center,
            graph,
            method,
            radius,
            radiusLatLng,
            searchPoints,
            (resolvedPoints: PointToDestination[]) => {
                const resultArray: string[] = [];
                resolvedPoints.forEach((point: PointToDestination) => {
                    resultArray.push(point.point.lng + " " + point.point.lat);
                });
                onSuccess("POLYGON ((" + resultArray.join(", ") + "))");
            },
            onError,
        );
    }

    private static processIsoCurve(
        offset: number,
        center: LatLng,
        graph: TravelMode,
        method: string,
        radius: number,
        radiusLatLng: LatLng,
        searchPoints: PointToDestination[],
        onSuccess: any,
        onError: any): void {

        // Limit query Google API
        const MAX_GOOGLE_API_POINT: number = 25;

        // create a subset of search point
        const origins: string[] = [];
        for (let i: number = offset; i < offset + MAX_GOOGLE_API_POINT; i++) {
            if (searchPoints.length > i) {
                origins.push(searchPoints[i].point.lat + " " + searchPoints[i].point.lng);
            }
        }

        const service = new google.maps.DistanceMatrixService();
        service.getDistanceMatrix(
            {
                origins,
                destinations: [center.lat + " " + center.lng],
                travelMode: graph,
            },
            (response: DistanceMatrixResponse, status: DistanceMatrixStatus) => {

                if (!response) {
                    onError(status);
                    return;
                }

                response.rows.forEach((row: DistanceMatrixResponseRow, key: number) => {
                    if (row.elements.length && row.elements[0].duration) {
                        // Compute radiusLatLng corrected by interpolated google duration
                        const coeffMethod =  "time" === method ? 60 : 1000;
                        const coeffRadius = radius * coeffMethod / row.elements[0].duration.value;
                        const rowRadiusLatLng: LatLng = GoogleIsochrone.getRadiusLatLng(center, radius * coeffRadius);

                        // Compute point form radiusLatLng corrected
                        searchPoints[key + offset] = GoogleIsochrone.getPointFromRadiusLatLng(
                            center,
                            searchPoints[key + offset].radian,
                            rowRadiusLatLng,
                        );
                    }
                });
                offset += MAX_GOOGLE_API_POINT;
                // Continue to compute correctedPoints array
                if ( offset < searchPoints.length) {
                    GoogleIsochrone.processIsoCurve(
                        offset,
                        center,
                        graph,
                        method,
                        radius,
                        radiusLatLng,
                        searchPoints,
                        onSuccess,
                        onError,
                    );
                } else {
                    onSuccess(searchPoints); // finish, call success
                }
            },
        );
    }

    private static getRadiusLatLng(center: LatLng, radius: number): LatLng {
        const latitude = (radius / 6378.135) * (180 / Math.PI);
        const longitude = latitude / Math.cos(center.lat * (Math.PI / 180));

        return new LatLng(latitude, longitude);
    }

    private static getPointFromRadiusLatLng(center: LatLng, radian: number, radiusLatLng: LatLng ): PointToDestination {
        const latitude = center.lat + (radiusLatLng.lat * Math.sin(radian));
        const longitude = center.lng + (radiusLatLng.lng * Math.cos(radian));

        return { point: new LatLng(latitude, longitude) , radian };
    }
}
