import { Tyr } from 'tyranid';

export default new Tyr.Collection({
  id: 'mto',
  name: 'metricObservation',
  dbName: 'metricObservations',
  openAPI: {
    parent: 'metric',
    useParentScope: true
  },
  fields: {
    _id: { is: 'mongoid' },
    metricId: { link: 'metric' },
    date: { is: 'date' },
    value: { is: 'double' }
  },
});