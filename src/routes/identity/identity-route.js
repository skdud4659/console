import BaseHeader from '@/containers/header/Header';
import Identity from '@/views/identity/Identity';
import User from '@/views/identity/user/User';
import Project from '@//views/identity/project/Project';
import Project1 from '@//views/identity/project/Project1';

export default {
    path: 'identity',
    name: 'identity',
    redirect: '/identity/project',
    meta: { label: 'Identity', requiresAuth: true },
    components: {
        header: BaseHeader,
        main: Identity,
    },
    children: [
        {
            path: 'project',
            name: 'project',
            meta: { label: 'Project', requiresAuth: true },
            component: Project,
        },
        {
            path: 'sample-project',
            name: 'sample-project',
            meta: { label: 'sample-project', requiresAuth: true },
            component: Project1,
        },
        {
            path: 'user',
            name: 'user',
            meta: { label: 'User', requiresAuth: true },
            component: User,
        },
    ],
};
